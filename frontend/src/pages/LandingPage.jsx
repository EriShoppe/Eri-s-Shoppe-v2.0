import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { images } from '../config/images';
import CarBookingModal from '../components/CarBookingModal';
import axios from 'axios';
import {
  Car,
  Monitor,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Wrench,
  Users,
  Star
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    if (!formData.name || !formData.email || !formData.service) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Thank you! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">Eri's Shoppe</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('car-services')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Car Services
              </button>
              <button onClick={() => scrollToSection('computer-services')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Computer Services
              </button>
              <button onClick={() => scrollToSection('freelancing')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Consulting
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </button>
              <Button onClick={() => scrollToSection('contact')} className="bg-slate-900 hover:bg-slate-800 text-white">
                Book Now
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('car-services')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Car Services
              </button>
              <button onClick={() => scrollToSection('computer-services')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Computer Services
              </button>
              <button onClick={() => scrollToSection('freelancing')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Consulting
              </button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Contact
              </button>
              <Button onClick={() => scrollToSection('contact')} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Your Trusted Partner for All Services
              </h2>
              <p className="text-xl text-slate-600">
                From car rentals to computer solutions and professional consulting — we deliver quality, reliability, and excellence in every service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection('contact')} size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Schedule a Service <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button onClick={() => scrollToSection('car-services')} size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50">
                  View Services
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">Luzonwide Coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-slate-600">Trusted & Reliable</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={images.hero.main}
                alt={images.hero.alt}
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Car Services Section */}
      <section id="car-services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-slate-100 rounded-full mb-4">
              <Car className="h-6 w-6 text-slate-900" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Car Hire & Transport Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional driving and self-drive options across Luzon with competitive rates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* With Driver */}
            <Card className="border-2 hover:border-slate-300 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6" />
                  With Driver
                </CardTitle>
                <CardDescription>Sit back, relax, and let us drive you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Short Trips / City Rides</h4>
                    <div className="space-y-2 text-slate-700">
                      <p>Starting rate: <span className="font-bold text-slate-900">₱400</span></p>
                      <p>Exceeding hour: <span className="font-bold text-slate-900">+₱200</span></p>
                      <p className="text-sm text-slate-600">Maximum 4 hours</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Half Day (12 hrs)</h4>
                    <p className="text-3xl font-bold text-slate-900">₱2,500</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Full Day (24 hrs)</h4>
                    <p className="text-3xl font-bold text-slate-900">₱3,500</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Airport Transfer</h4>
                    <p className="text-2xl font-bold text-slate-900">₱900 <span className="text-base font-normal text-slate-600">one-way</span></p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Budget Friendly Rate</h4>
                    <p className="text-sm text-blue-800">Base fare + Dynamic fare (distance + time spent)</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Why these rates?</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>✓ Covers driver's time, fuel, parking, and car maintenance</li>
                    <li>✓ Flexible options for multiple stops or long rides</li>
                    <li>✓ Competitive with local city rides</li>
                  </ul>
                </div>

                <Button onClick={() => scrollToSection('contact')} className="w-full bg-slate-900 hover:bg-slate-800">
                  Book With Driver
                </Button>
              </CardContent>
            </Card>

            {/* Self-Drive */}
            <Card className="border-2 hover:border-slate-300 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6" />
                  Self-Drive
                </CardTitle>
                <CardDescription>Take the wheel and explore at your own pace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Half Day (12 hrs)</h4>
                    <p className="text-3xl font-bold text-slate-900">₱1,800</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Full Day (24 hrs)</h4>
                    <p className="text-3xl font-bold text-slate-900">₱2,500</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Why these rates?</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>✓ Includes well-maintained car and insurance</li>
                    <li>✓ Fuel is full-to-full (you return it full)</li>
                    <li>✓ Fair for personal trips, errands, or road trips</li>
                  </ul>
                </div>

                <Button onClick={() => scrollToSection('contact')} className="w-full bg-slate-900 hover:bg-slate-800">
                  Book Self-Drive
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-slate-700">
              <strong>Note:</strong> Kapag lumagpas sa maximum hours (4, 12, 24), automatic upgrade na po ang ma-a-avail. Maraming salamat po.
            </p>
          </div>

          <div className="mt-12">
            <img
              src={images.carServices.featured}
              alt={images.carServices.alt}
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Computer Services Section */}
      <section id="computer-services" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-slate-900 rounded-full mb-4">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Computer Services & Solutions</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Expert computer services from builds to maintenance and software solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-slate-900" />
                </div>
                <CardTitle>PC Builds</CardTitle>
                <CardDescription>Custom computer builds tailored to your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Gaming PCs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Workstation builds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Budget-friendly options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Component selection advice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-slate-900" />
                </div>
                <CardTitle>Maintenance & Repair</CardTitle>
                <CardDescription>Keep your system running smoothly</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Hardware diagnostics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Component replacement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>System cleaning & optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Performance upgrades</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-slate-900" />
                </div>
                <CardTitle>Software Solutions</CardTitle>
                <CardDescription>Latest software and activation services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Windows installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Windows activation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Latest software provisioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Driver updates & support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-white rounded-2xl p-8 shadow-md">
            <p className="text-lg text-slate-600 mb-6">
              All computer services are priced based on your specific needs
            </p>
            <Button onClick={() => scrollToSection('contact')} size="lg" className="bg-slate-900 hover:bg-slate-800">
              Contact for Quote
            </Button>
          </div>

          <div className="mt-12">
            <img
              src={images.computerServices.featured}
              alt={images.computerServices.alt}
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Freelancing & Consulting Section */}
      <section id="freelancing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={images.consulting.featured}
                alt={images.consulting.alt}
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center p-2 bg-slate-100 rounded-full mb-4">
                <Briefcase className="h-6 w-6 text-slate-900" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Expert Freelancing & Consultation</h2>
              <p className="text-xl text-slate-600">
                Professional guidance and project consultation to help bring your ideas to life
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Project Consultation</h4>
                    <p className="text-slate-600">Get expert advice on your projects from planning to execution</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Expert Guidance</h4>
                    <p className="text-slate-600">Leverage years of experience to navigate complex challenges</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Results-Oriented</h4>
                    <p className="text-slate-600">Focused on delivering practical solutions that work</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => scrollToSection('contact')} size="lg" className="bg-slate-900 hover:bg-slate-800">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ready to book a service? We're here to help. Fill out the form or reach us directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Interested In *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="car-with-driver">Car Service - With Driver</option>
                    <option value="car-self-drive">Car Service - Self Drive</option>
                    <option value="computer">Computer Services</option>
                    <option value="consulting">Freelancing & Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your needs..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-slate-300">0909 967 4035</p>
                      <p className="text-sm text-slate-400 mt-1">Available 24/7 for bookings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-slate-300">rensengamboa@gmail.com</p>
                      <p className="text-sm text-slate-400 mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">WhatsApp</h4>
                      <p className="text-slate-300">0909 967 4035</p>
                      <p className="text-sm text-slate-400 mt-1">Quick response via WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Service Area</h4>
                      <p className="text-slate-300">Luzonwide Coverage</p>
                      <p className="text-sm text-slate-400 mt-1">We serve all major cities across Luzon</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Business Hours</h4>
                      <p className="text-slate-300">24/7 for Car Services</p>
                      <p className="text-slate-300">Mon-Sat: 9AM-6PM for Computer & Consulting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Eri's Shoppe</h3>
              <p className="text-sm">
                Your trusted partner for car services, computer solutions, and professional consulting across Luzon.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('car-services')} className="hover:text-white transition-colors">Car Hire</button></li>
                <li><button onClick={() => scrollToSection('car-services')} className="hover:text-white transition-colors">Transport Services</button></li>
                <li><button onClick={() => scrollToSection('computer-services')} className="hover:text-white transition-colors">Computer Services</button></li>
                <li><button onClick={() => scrollToSection('freelancing')} className="hover:text-white transition-colors">Consulting</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('car-services')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Book Now</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <p className="text-sm mb-2">Follow us for updates and special offers</p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Eri's Shoppe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
