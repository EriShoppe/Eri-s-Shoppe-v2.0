import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { images } from '../config/images';
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
  Users,
  Wrench,
  Star,
  Send
} from 'lucide-react';

const SimpleLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Direct contact actions
  const handleEmailClick = () => {
    window.location.href = 'mailto:rensengamboa@gmail.com?subject=Service Inquiry - Eri\'s Shoppe';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:09099674035';
  };

  const handleMessengerClick = () => {
    // WhatsApp link (works better than Facebook Messenger for direct contact)
    window.open('https://wa.me/639099674035?text=Hi! I\'m interested in your services', '_blank');
  };

  const handleSMSClick = () => {
    window.location.href = 'sms:09099674035?body=Hi! I\'m interested in your services';
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
              <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </button>
              <Button onClick={handleMessengerClick} className="bg-slate-900 hover:bg-slate-800 text-white">
                Message Us
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
              <button onClick={() => scrollToSection('services')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Services
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Pricing
              </button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">
                Contact
              </button>
              <Button onClick={handleMessengerClick} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Message Us
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
                <Button onClick={handleMessengerClick} size="lg" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Us
                </Button>
                <Button onClick={handlePhoneClick} size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now
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

      {/* Services Overview */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Car Services */}
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-slate-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Car Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Professional driving and self-drive options across Luzon</p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>With Driver Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Self-Drive Options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Airport Transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Luzonwide Coverage</span>
                  </li>
                </ul>
                <Button onClick={handleMessengerClick} className="w-full bg-slate-900 hover:bg-slate-800">
                  Inquire Now
                </Button>
              </CardContent>
            </Card>

            {/* Computer Services */}
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-slate-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Computer Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Expert computer services from builds to maintenance</p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Custom PC Builds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Repairs & Maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Software Installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Windows Activation</span>
                  </li>
                </ul>
                <Button onClick={handleMessengerClick} className="w-full bg-slate-900 hover:bg-slate-800">
                  Get Quote
                </Button>
              </CardContent>
            </Card>

            {/* Consulting */}
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-slate-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Professional guidance for your projects</p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Project Consultation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Expert Guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Technical Advisory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Results-Oriented</span>
                  </li>
                </ul>
                <Button onClick={handleMessengerClick} className="w-full bg-slate-900 hover:bg-slate-800">
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Car Service Pricing</h2>
            <p className="text-xl text-slate-600">Transparent and competitive rates</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* With Driver Pricing */}
            <Card className="border-2">
              <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  With Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Short Trips (Up to 4 hrs)</p>
                    <p className="text-2xl font-bold text-slate-900">₱400 <span className="text-sm font-normal">starting</span></p>
                    <p className="text-sm text-slate-600">+₱200 per exceeding hour</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Half Day (12 hrs)</p>
                    <p className="text-3xl font-bold text-slate-900">₱2,500</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Full Day (24 hrs)</p>
                    <p className="text-3xl font-bold text-slate-900">₱3,500</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Airport Transfer</p>
                    <p className="text-2xl font-bold text-slate-900">₱900 <span className="text-sm font-normal">one-way</span></p>
                  </div>
                </div>
                <Button onClick={handleMessengerClick} className="w-full mt-6 bg-slate-900 hover:bg-slate-800">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Self-Drive Pricing */}
            <Card className="border-2">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Car className="h-6 w-6" />
                  Self-Drive
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Half Day (12 hrs)</p>
                    <p className="text-3xl font-bold text-slate-900">₱1,800</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Full Day (24 hrs)</p>
                    <p className="text-3xl font-bold text-slate-900">₱2,500</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Includes:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Well-maintained vehicle</li>
                      <li>✓ Insurance coverage</li>
                      <li>✓ Full-to-full fuel policy</li>
                    </ul>
                  </div>
                </div>
                <Button onClick={handleMessengerClick} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
              <strong>Note:</strong> Kapag lumagpas sa maximum hours, automatic upgrade ang ma-avail. Maraming salamat po!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-slate-300 mb-12">
            Ready to book a service? Reach out through your preferred channel
          </p>

          {/* Contact Buttons */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Button 
              onClick={handleMessengerClick}
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white h-auto py-6 flex flex-col gap-2"
            >
              <MessageCircle className="h-8 w-8" />
              <span className="text-sm">WhatsApp</span>
            </Button>
            
            <Button 
              onClick={handlePhoneClick}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-6 flex flex-col gap-2"
            >
              <Phone className="h-8 w-8" />
              <span className="text-sm">Call</span>
            </Button>
            
            <Button 
              onClick={handleSMSClick}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white h-auto py-6 flex flex-col gap-2"
            >
              <Send className="h-8 w-8" />
              <span className="text-sm">SMS</span>
            </Button>
            
            <Button 
              onClick={handleEmailClick}
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white h-auto py-6 flex flex-col gap-2"
            >
              <Mail className="h-8 w-8" />
              <span className="text-sm">Email</span>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 p-6 rounded-lg">
              <Phone className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-slate-300">0909 967 4035</p>
              <p className="text-sm text-slate-400 mt-1">Available 24/7</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <Mail className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-slate-300">rensengamboa@gmail.com</p>
              <p className="text-sm text-slate-400 mt-1">Response within 24hrs</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <MapPin className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-2">Coverage</h3>
              <p className="text-slate-300">Luzonwide</p>
              <p className="text-sm text-slate-400 mt-1">All major cities</p>
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
                <li>Car Hire & Transport</li>
                <li>Computer Services</li>
                <li>Consulting</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>0909 967 4035</li>
                <li>rensengamboa@gmail.com</li>
                <li>Luzonwide Coverage</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
              <div className="flex gap-3">
                <button 
                  onClick={handleMessengerClick}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button 
                  onClick={handlePhoneClick}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleEmailClick}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
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

export default SimpleLandingPage;
