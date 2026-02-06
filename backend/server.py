from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from models import Booking, BookingCreate, ContactFormEntry, ContactFormSubmit
from email_service import email_service
from auth import authenticate_admin, create_access_token, verify_token


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()


# Auth dependency
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin token"""
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return payload


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Auth Models
class AdminLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class BookingStatusUpdate(BaseModel):
    status: str  # pending, confirmed, cancelled, completed

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Booking Endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_input: BookingCreate):
    """Create a new booking and send email notifications"""
    try:
        # Calculate booking end date based on duration
        booking_end_date = None
        if booking_input.duration_hours:
            booking_end_date = booking_input.booking_date + timedelta(hours=booking_input.duration_hours)
        
        # Create booking object
        booking_dict = booking_input.model_dump()
        booking = Booking(**booking_dict, booking_end_date=booking_end_date)
        
        # Save to database
        doc = booking.model_dump()
        doc['booking_date'] = doc['booking_date'].isoformat()
        doc['created_at'] = doc['created_at'].isoformat()
        if doc['booking_end_date']:
            doc['booking_end_date'] = doc['booking_end_date'].isoformat()
        
        await db.bookings.insert_one(doc)
        
        # Send email notifications
        try:
            email_data = booking.model_dump()
            await email_service.send_booking_confirmation_to_customer(email_data)
            await email_service.send_booking_notification_to_business(email_data)
            logger.info(f"Booking created and emails sent for {booking.email}")
        except Exception as e:
            logger.error(f"Failed to send emails for booking {booking.id}: {str(e)}")
            # Continue even if email fails - booking is still saved
        
        return booking
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/bookings/availability")
async def get_booking_availability(start_date: str, end_date: str):
    """Get booking availability for calendar"""
    try:
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        
        # Get all bookings in the date range
        bookings = await db.bookings.find({
            "booking_date": {"$gte": start.isoformat(), "$lte": end.isoformat()},
            "status": {"$ne": "cancelled"}
        }, {"_id": 0}).to_list(1000)
        
        # Create list of blocked time slots
        blocked_slots = []
        for booking in bookings:
            booking_start = datetime.fromisoformat(booking['booking_date'])
            booking_end = datetime.fromisoformat(booking['booking_end_date']) if booking.get('booking_end_date') else booking_start
            
            blocked_slots.append({
                "id": booking['id'],
                "start": booking['booking_date'],
                "end": booking['booking_end_date'] if booking.get('booking_end_date') else booking['booking_date'],
                "service_type": booking['service_type']
            })
        
        return {"blocked_slots": blocked_slots}
    except Exception as e:
        logger.error(f"Error getting availability: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings(admin: dict = Depends(get_current_admin)):
    """Get all bookings (admin endpoint - protected)"""
    try:
        bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO strings back to datetime
        for booking in bookings:
            if isinstance(booking['booking_date'], str):
                booking['booking_date'] = datetime.fromisoformat(booking['booking_date'])
            if isinstance(booking['created_at'], str):
                booking['created_at'] = datetime.fromisoformat(booking['created_at'])
            if booking.get('booking_end_date') and isinstance(booking['booking_end_date'], str):
                booking['booking_end_date'] = datetime.fromisoformat(booking['booking_end_date'])
        
        return bookings
    except Exception as e:
        logger.error(f"Error getting bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Contact Form Endpoints
@api_router.post("/contact", response_model=ContactFormEntry)
async def submit_contact_form(contact_input: ContactFormSubmit):
    """Submit contact form and send email notification"""
    try:
        # Create contact form entry
        contact_dict = contact_input.model_dump()
        contact_entry = ContactFormEntry(**contact_dict)
        
        # Save to database
        doc = contact_entry.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.contact_forms.insert_one(doc)
        
        # Send email notification to business owner
        try:
            await email_service.send_contact_form_notification(contact_entry.model_dump())
            logger.info(f"Contact form submitted and email sent for {contact_entry.email}")
        except Exception as e:
            logger.error(f"Failed to send email for contact form {contact_entry.id}: {str(e)}")
            # Continue even if email fails
        
        return contact_entry
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/contact", response_model=List[ContactFormEntry])
async def get_contact_forms(admin: dict = Depends(get_current_admin)):
    """Get all contact form submissions (admin endpoint - protected)"""
    try:
        contacts = await db.contact_forms.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO strings back to datetime
        for contact in contacts:
            if isinstance(contact['created_at'], str):
                contact['created_at'] = datetime.fromisoformat(contact['created_at'])
        
        return contacts
    except Exception as e:
        logger.error(f"Error getting contact forms: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Admin Authentication Endpoints
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login_data: AdminLogin):
    """Admin login endpoint"""
    if not authenticate_admin(login_data.username, login_data.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": login_data.username, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}


@api_router.get("/admin/verify")
async def verify_admin(admin: dict = Depends(get_current_admin)):
    """Verify admin token"""
    return {"valid": True, "username": admin.get("sub")}


# Admin Booking Management
@api_router.patch("/admin/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update booking status (admin only)"""
    try:
        valid_statuses = ["pending", "confirmed", "cancelled", "completed"]
        if status_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        result = await db.bookings.update_one(
            {"id": booking_id},
            {"$set": {"status": status_update.status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"success": True, "message": f"Booking status updated to {status_update.status}"}
    except Exception as e:
        logger.error(f"Error updating booking status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    try:
        total_bookings = await db.bookings.count_documents({})
        pending_bookings = await db.bookings.count_documents({"status": "pending"})
        confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
        completed_bookings = await db.bookings.count_documents({"status": "completed"})
        total_contacts = await db.contact_forms.count_documents({})
        new_contacts = await db.contact_forms.count_documents({"status": "new"})
        
        return {
            "total_bookings": total_bookings,
            "pending_bookings": pending_bookings,
            "confirmed_bookings": confirmed_bookings,
            "completed_bookings": completed_bookings,
            "total_contacts": total_contacts,
            "new_contacts": new_contacts
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()