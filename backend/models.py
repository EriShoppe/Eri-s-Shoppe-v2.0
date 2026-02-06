from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service_type: str  # 'car-with-driver', 'car-self-drive', 'computer', 'consulting'
    pickup_location: Optional[str] = None
    dropoff_location: Optional[str] = None
    booking_date: datetime
    duration_hours: Optional[int] = None  # 4, 12, 24 hours
    package_type: Optional[str] = None  # 'short-trip', 'half-day', 'full-day', 'airport'
    message: Optional[str] = None


class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service_type: str
    pickup_location: Optional[str] = None
    dropoff_location: Optional[str] = None
    booking_date: datetime
    booking_end_date: Optional[datetime] = None  # Calculated based on duration
    duration_hours: Optional[int] = None
    package_type: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContactFormSubmit(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: str
    message: Optional[str] = None


class ContactFormEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: str
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new, contacted, closed
