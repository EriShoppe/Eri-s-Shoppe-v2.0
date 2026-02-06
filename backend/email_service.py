import aiosmtplib
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.smtp_user = os.environ.get('SMTP_USER')
        self.smtp_password = os.environ.get('SMTP_PASSWORD')
        self.business_email = os.environ.get('BUSINESS_EMAIL')

    async def send_email(self, to_email: str, subject: str, html_content: str, text_content: str = None):
        """Send email using Gmail SMTP"""
        try:
            message = MIMEMultipart('alternative')
            message['From'] = self.smtp_user
            message['To'] = to_email
            message['Subject'] = subject

            # Add text and HTML parts
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                message.attach(part1)
            
            part2 = MIMEText(html_content, 'html')
            message.attach(part2)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                use_tls=True
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            raise

    async def send_booking_confirmation_to_customer(self, booking_data: dict):
        """Send booking confirmation email to customer"""
        customer_email = booking_data['email']
        customer_name = booking_data['name']
        
        subject = "Booking Confirmation - Eri's Shoppe"
        
        # Format booking date
        booking_date = booking_data['booking_date']
        if isinstance(booking_date, str):
            booking_date = datetime.fromisoformat(booking_date.replace('Z', '+00:00'))
        formatted_date = booking_date.strftime("%B %d, %Y at %I:%M %p")
        
        # Determine service details
        service_name = self._get_service_name(booking_data['service_type'])
        duration_text = self._get_duration_text(booking_data)
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                .booking-details {{ background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .detail-row {{ display: flex; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }}
                .detail-label {{ font-weight: bold; width: 150px; color: #64748b; }}
                .detail-value {{ flex: 1; }}
                .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }}
                .button {{ background-color: #0f172a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Dear {customer_name},</p>
                    <p>Thank you for choosing Eri's Shoppe! Your booking has been confirmed.</p>
                    
                    <div class="booking-details">
                        <h2 style="margin-top: 0; color: #0f172a;">Booking Details</h2>
                        <div class="detail-row">
                            <div class="detail-label">Service:</div>
                            <div class="detail-value">{service_name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date & Time:</div>
                            <div class="detail-value">{formatted_date}</div>
                        </div>
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Duration:</div>
                            <div class="detail-value">{duration_text}</div>
                        </div>
                        ''' if duration_text else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Pickup Location:</div>
                            <div class="detail-value">{booking_data.get('pickup_location', 'N/A')}</div>
                        </div>
                        ''' if booking_data.get('pickup_location') else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Drop-off Location:</div>
                            <div class="detail-value">{booking_data.get('dropoff_location', 'N/A')}</div>
                        </div>
                        ''' if booking_data.get('dropoff_location') else ''}
                        <div class="detail-row">
                            <div class="detail-label">Contact Phone:</div>
                            <div class="detail-value">{booking_data['phone']}</div>
                        </div>
                    </div>
                    
                    <p>We will contact you shortly to confirm the final details.</p>
                    <p>If you have any questions, feel free to reach out:</p>
                    <ul>
                        <li>Phone/WhatsApp: 0909 967 4035</li>
                        <li>Email: rensengamboa@gmail.com</li>
                    </ul>
                    
                    <div class="footer">
                        <p><strong>Eri's Shoppe</strong><br>
                        Luzonwide Coverage<br>
                        Your Trusted Partner for All Services</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Booking Confirmation - Eri's Shoppe
        
        Dear {customer_name},
        
        Thank you for choosing Eri's Shoppe! Your booking has been confirmed.
        
        Booking Details:
        Service: {service_name}
        Date & Time: {formatted_date}
        {f"Duration: {duration_text}" if duration_text else ""}
        {f"Pickup Location: {booking_data.get('pickup_location')}" if booking_data.get('pickup_location') else ""}
        {f"Drop-off Location: {booking_data.get('dropoff_location')}" if booking_data.get('dropoff_location') else ""}
        Contact Phone: {booking_data['phone']}
        
        We will contact you shortly to confirm the final details.
        
        Contact us:
        Phone/WhatsApp: 0909 967 4035
        Email: rensengamboa@gmail.com
        
        Eri's Shoppe - Your Trusted Partner for All Services
        """
        
        await self.send_email(customer_email, subject, html_content, text_content)

    async def send_booking_notification_to_business(self, booking_data: dict):
        """Send new booking notification to business owner"""
        subject = f"New Booking Received - {self._get_service_name(booking_data['service_type'])}"
        
        # Format booking date
        booking_date = booking_data['booking_date']
        if isinstance(booking_date, str):
            booking_date = datetime.fromisoformat(booking_date.replace('Z', '+00:00'))
        formatted_date = booking_date.strftime("%B %d, %Y at %I:%M %p")
        
        duration_text = self._get_duration_text(booking_data)
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                .booking-details {{ background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .detail-row {{ padding: 10px 0; border-bottom: 1px solid #e2e8f0; }}
                .detail-label {{ font-weight: bold; color: #64748b; }}
                .detail-value {{ margin-top: 5px; }}
                .urgent {{ background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 New Booking Received!</h1>
                </div>
                <div class="content">
                    <div class="urgent">
                        <strong>Action Required:</strong> Please contact the customer to confirm the booking.
                    </div>
                    
                    <div class="booking-details">
                        <h2 style="margin-top: 0; color: #0f172a;">Customer Information</h2>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">{booking_data['name']}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Email:</div>
                            <div class="detail-value">{booking_data['email']}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Phone:</div>
                            <div class="detail-value">{booking_data['phone']}</div>
                        </div>
                        
                        <h2 style="margin-top: 30px; color: #0f172a;">Booking Details</h2>
                        <div class="detail-row">
                            <div class="detail-label">Service:</div>
                            <div class="detail-value">{self._get_service_name(booking_data['service_type'])}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date & Time:</div>
                            <div class="detail-value">{formatted_date}</div>
                        </div>
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Duration:</div>
                            <div class="detail-value">{duration_text}</div>
                        </div>
                        ''' if duration_text else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Package:</div>
                            <div class="detail-value">{booking_data.get('package_type', 'N/A').replace('-', ' ').title()}</div>
                        </div>
                        ''' if booking_data.get('package_type') else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Pickup Location:</div>
                            <div class="detail-value">{booking_data.get('pickup_location')}</div>
                        </div>
                        ''' if booking_data.get('pickup_location') else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Drop-off Location:</div>
                            <div class="detail-value">{booking_data.get('dropoff_location')}</div>
                        </div>
                        ''' if booking_data.get('dropoff_location') else ''}
                        {f'''
                        <div class="detail-row">
                            <div class="detail-label">Message:</div>
                            <div class="detail-value">{booking_data.get('message')}</div>
                        </div>
                        ''' if booking_data.get('message') else ''}
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        await self.send_email(self.business_email, subject, html_content)

    async def send_contact_form_notification(self, contact_data: dict):
        """Send contact form submission notification to business owner"""
        subject = f"New Contact Form Submission - {contact_data['service']}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #0f172a; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f8f9fa; padding: 30px; }}
                .detail-row {{ padding: 10px 0; border-bottom: 1px solid #e2e8f0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="detail-row">
                        <strong>Name:</strong> {contact_data['name']}
                    </div>
                    <div class="detail-row">
                        <strong>Email:</strong> {contact_data['email']}
                    </div>
                    <div class="detail-row">
                        <strong>Phone:</strong> {contact_data.get('phone', 'N/A')}
                    </div>
                    <div class="detail-row">
                        <strong>Service:</strong> {contact_data['service']}
                    </div>
                    {f'''
                    <div class="detail-row">
                        <strong>Message:</strong><br>{contact_data.get('message')}
                    </div>
                    ''' if contact_data.get('message') else ''}
                </div>
            </div>
        </body>
        </html>
        """
        
        await self.send_email(self.business_email, subject, html_content)

    def _get_service_name(self, service_type: str) -> str:
        """Get friendly service name"""
        service_names = {
            'car-with-driver': 'Car Service - With Driver',
            'car-self-drive': 'Car Service - Self Drive',
            'computer': 'Computer Services',
            'consulting': 'Freelancing & Consulting'
        }
        return service_names.get(service_type, service_type)

    def _get_duration_text(self, booking_data: dict) -> str:
        """Get duration text"""
        if booking_data.get('duration_hours'):
            hours = booking_data['duration_hours']
            if hours == 24:
                return "Full Day (24 hours)"
            elif hours == 12:
                return "Half Day (12 hours)"
            elif hours <= 4:
                return f"{hours} hour(s)"
            else:
                return f"{hours} hours"
        return ""


# Create singleton instance
email_service = EmailService()
