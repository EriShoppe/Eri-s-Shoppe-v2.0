import React, { useState, useEffect } from 'react';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, MapPin, Car, X } from 'lucide-react';
import { format, addHours, isBefore, startOfDay } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CarBookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    packageType: '',
    durationHours: null,
    pickupLocation: '',
    dropoffLocation: '',
    message: ''
  });

  const serviceTypes = [
    { value: 'car-with-driver', label: 'With Driver' },
    { value: 'car-self-drive', label: 'Self-Drive' }
  ];

  const packageOptions = {
    'car-with-driver': [
      { value: 'short-trip', label: 'Short Trip (Up to 4 hrs)', hours: 4, price: '₱400 starting' },
      { value: 'half-day', label: 'Half Day (12 hrs)', hours: 12, price: '₱2,500' },
      { value: 'full-day', label: 'Full Day (24 hrs)', hours: 24, price: '₱3,500' },
      { value: 'airport', label: 'Airport Transfer', hours: 2, price: '₱900 one-way' }
    ],
    'car-self-drive': [
      { value: 'half-day', label: 'Half Day (12 hrs)', hours: 12, price: '₱1,800' },
      { value: 'full-day', label: 'Full Day (24 hrs)', hours: 24, price: '₱2,500' }
    ]
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen]);

  const fetchAvailability = async () => {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);
      
      const response = await axios.get(`${API}/bookings/availability`, {
        params: {
          start_date: today.toISOString(),
          end_date: endDate.toISOString()
        }
      });
      
      setBlockedSlots(response.data.blocked_slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const isDateBlocked = (date) => {
    if (!selectedDate || !formData.durationHours) return false;
    
    const checkStart = new Date(date);
    checkStart.setHours(0, 0, 0, 0);
    const checkEnd = new Date(checkStart);
    checkEnd.setHours(23, 59, 59, 999);
    
    return blockedSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      
      // Check if there's any overlap
      return (checkStart <= slotEnd && checkEnd >= slotStart);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-set duration when package is selected
    if (name === 'packageType' && formData.serviceType) {
      const packages = packageOptions[formData.serviceType];
      const selectedPackage = packages.find(p => p.value === value);
      if (selectedPackage) {
        setFormData(prev => ({ ...prev, durationHours: selectedPackage.hours }));
      }
    }
  };

  const handleServiceTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      serviceType: value,
      packageType: '',
      durationHours: null
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType || !formData.packageType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.serviceType,
        package_type: formData.packageType,
        duration_hours: formData.durationHours,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation || null,
        booking_date: bookingDateTime.toISOString(),
        message: formData.message || null
      };

      await axios.post(`${API}/bookings`, bookingData);
      
      toast.success('Booking confirmed! Check your email for details.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        packageType: '',
        durationHours: null,
        pickupLocation: '',
        dropoffLocation: '',
        message: ''
      });
      setSelectedDate(null);
      setSelectedTime('09:00');
      setStep(1);
      onClose();
      fetchAvailability(); // Refresh availability
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <CardHeader>
          <CardTitle className="text-2xl">Book Car Service</CardTitle>
          <CardDescription>
            Step {step} of 3 - {step === 1 ? 'Select Service' : step === 2 ? 'Choose Date & Time' : 'Your Information'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Select Service Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceTypes.map(service => (
                    <button
                      key={service.value}
                      onClick={() => handleServiceTypeChange(service.value)}
                      className={`p-6 border-2 rounded-lg text-left transition-all ${
                        formData.serviceType === service.value
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Car className="h-8 w-8 mb-2" />
                      <h3 className="font-semibold text-lg">{service.label}</h3>
                    </button>
                  ))}
                </div>
              </div>

              {formData.serviceType && (
                <div>
                  <label className="block text-sm font-medium mb-3">Select Package</label>
                  <div className="space-y-3">
                    {packageOptions[formData.serviceType].map(pkg => (
                      <button
                        key={pkg.value}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            packageType: pkg.value,
                            durationHours: pkg.hours
                          }));
                        }}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          formData.packageType === pkg.value
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{pkg.label}</h4>
                            <p className="text-sm text-slate-600 mt-1">{pkg.price}</p>
                          </div>
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.packageType && (
                <Button onClick={() => setStep(2)} className="w-full bg-slate-900 hover:bg-slate-800">
                  Continue to Date Selection
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Select Date</label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = startOfDay(new Date());
                      return isBefore(date, today) || isDateBlocked(date);
                    }}
                    className="rounded-md border"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2 text-center">
                  <span className="inline-block w-3 h-3 bg-slate-200 rounded mr-1"></span>
                  Unavailable dates are disabled
                </p>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <option key={i} value={`${hour}:00`}>
                          {format(new Date().setHours(i, 0), 'h:00 a')}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate}
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                >
                  Continue to Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0909 XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pickup Location *</label>
                <Input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Enter pickup address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Drop-off Location (Optional)</label>
                <Input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleInputChange}
                  placeholder="Enter drop-off address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any special requests or additional information..."
                  rows={3}
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Service:</strong> {formData.serviceType === 'car-with-driver' ? 'With Driver' : 'Self-Drive'}</p>
                  <p><strong>Package:</strong> {packageOptions[formData.serviceType]?.find(p => p.value === formData.packageType)?.label}</p>
                  <p><strong>Date:</strong> {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> {formData.durationHours} hours</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarBookingModal;
