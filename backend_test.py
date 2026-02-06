#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime, timedelta
import uuid

class ErisShoppeAPITester:
    def __init__(self):
        # Use public endpoint from frontend env
        self.base_url = "https://multi-service-pro.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0

    def log_test(self, name, success, response_data=None, error=None):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ PASS: {name}")
            if response_data and isinstance(response_data, dict):
                print(f"   Response keys: {list(response_data.keys())}")
        else:
            print(f"❌ FAIL: {name}")
            if error:
                print(f"   Error: {error}")
            if response_data:
                print(f"   Response: {response_data}")
        print()

    def test_api_health(self):
        """Test basic API health"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else response.text
            self.log_test("API Health Check", success, data)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, error=str(e))
            return False

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "phone": "09099674035",
            "service": "car-with-driver",
            "message": "Test message for contact form"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            
            # Verify response structure
            if success and isinstance(data, dict):
                required_fields = ['id', 'name', 'email', 'service', 'created_at']
                has_required = all(field in data for field in required_fields)
                success = success and has_required
                
            self.log_test("Contact Form Submission", success, data)
            return success, data.get('id') if isinstance(data, dict) else None
        except Exception as e:
            self.log_test("Contact Form Submission", False, error=str(e))
            return False, None

    def test_booking_availability(self):
        """Test booking availability endpoint"""
        try:
            start_date = datetime.now().isoformat()
            end_date = (datetime.now() + timedelta(days=30)).isoformat()
            
            response = requests.get(
                f"{self.base_url}/bookings/availability",
                params={
                    "start_date": start_date,
                    "end_date": end_date
                },
                timeout=10
            )
            
            success = response.status_code == 200
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            
            # Verify response structure
            if success and isinstance(data, dict):
                has_blocked_slots = 'blocked_slots' in data
                success = success and has_blocked_slots
                
            self.log_test("Booking Availability Check", success, data)
            return success
        except Exception as e:
            self.log_test("Booking Availability Check", False, error=str(e))
            return False

    def test_car_booking_creation(self):
        """Test car booking creation"""
        # Create booking for tomorrow at 2 PM
        booking_date = datetime.now() + timedelta(days=1)
        booking_date = booking_date.replace(hour=14, minute=0, second=0, microsecond=0)
        
        test_booking = {
            "name": "John Test Driver",
            "email": "john.testdriver@example.com",
            "phone": "09099674035",
            "service_type": "car-with-driver",
            "package_type": "half-day",
            "duration_hours": 12,
            "pickup_location": "Manila Airport",
            "dropoff_location": "BGC Taguig",
            "booking_date": booking_date.isoformat(),
            "message": "Test booking for integration testing"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/bookings",
                json=test_booking,
                headers={"Content-Type": "application/json"},
                timeout=30  # Longer timeout for email processing
            )
            
            success = response.status_code == 200
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            
            # Verify response structure
            if success and isinstance(data, dict):
                required_fields = ['id', 'name', 'email', 'service_type', 'booking_date', 'status']
                has_required = all(field in data for field in required_fields)
                has_end_date = 'booking_end_date' in data
                success = success and has_required and has_end_date
                
            self.log_test("Car Booking Creation", success, data)
            return success, data.get('id') if isinstance(data, dict) else None
        except Exception as e:
            self.log_test("Car Booking Creation", False, error=str(e))
            return False, None

    def test_get_all_bookings(self):
        """Test getting all bookings (admin endpoint)"""
        try:
            response = requests.get(f"{self.base_url}/bookings", timeout=10)
            success = response.status_code == 200
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            
            # Verify it's a list
            if success:
                success = isinstance(data, list)
                
            self.log_test("Get All Bookings", success, {"booking_count": len(data) if isinstance(data, list) else 0})
            return success
        except Exception as e:
            self.log_test("Get All Bookings", False, error=str(e))
            return False

    def test_get_contact_forms(self):
        """Test getting all contact forms (admin endpoint)"""
        try:
            response = requests.get(f"{self.base_url}/contact", timeout=10)
            success = response.status_code == 200
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            
            # Verify it's a list
            if success:
                success = isinstance(data, list)
                
            self.log_test("Get Contact Forms", success, {"form_count": len(data) if isinstance(data, list) else 0})
            return success
        except Exception as e:
            self.log_test("Get Contact Forms", False, error=str(e))
            return False

    def test_booking_with_different_durations(self):
        """Test booking with different duration packages"""
        durations = [
            ("short-trip", 4),
            ("half-day", 12),
            ("full-day", 24)
        ]
        
        all_passed = True
        for package_type, hours in durations:
            booking_date = datetime.now() + timedelta(days=2, hours=hours)
            booking_date = booking_date.replace(minute=0, second=0, microsecond=0)
            
            test_booking = {
                "name": f"Test {package_type.replace('-', ' ').title()}",
                "email": f"test.{package_type}@example.com",
                "phone": "09099674035",
                "service_type": "car-self-drive",
                "package_type": package_type,
                "duration_hours": hours,
                "pickup_location": "Test Location",
                "booking_date": booking_date.isoformat(),
                "message": f"Testing {package_type} booking"
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/bookings",
                    json=test_booking,
                    headers={"Content-Type": "application/json"},
                    timeout=20
                )
                
                success = response.status_code == 200
                if not success:
                    all_passed = False
                    
                data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_test(f"Booking Creation - {package_type}", success, 
                             {"duration_hours": data.get('duration_hours') if isinstance(data, dict) else None})
                
            except Exception as e:
                all_passed = False
                self.log_test(f"Booking Creation - {package_type}", False, error=str(e))
        
        return all_passed

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Eri's Shoppe Backend API Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
            
        # Test core functionality
        self.test_contact_form_submission()
        self.test_booking_availability()
        self.test_car_booking_creation()
        self.test_get_all_bookings()
        self.test_get_contact_forms()
        self.test_booking_with_different_durations()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    """Main test runner"""
    tester = ErisShoppeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())