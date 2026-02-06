import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Calendar,
  Users,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  TrendingUp,
  MessageSquare,
  Car,
  BarChart3
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      await verifyAuth();
      await fetchData();
    };
    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token');
    setLoading(true);
    
    try {
      const [statsRes, bookingsRes, contactsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setBookings(bookingsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setContacts(contactsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('admin_token');
    
    try {
      await axios.patch(
        `${API}/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Booking ${newStatus}!`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={`${variants[status] || ''} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceName = (serviceType) => {
    const names = {
      'car-with-driver': 'Car - With Driver',
      'car-self-drive': 'Car - Self Drive',
      'computer': 'Computer Services',
      'consulting': 'Consulting'
    };
    return names[serviceType] || serviceType;
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Eri's Shoppe</h1>
              <p className="text-sm text-slate-600">Admin Dashboard</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_bookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending_bookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.confirmed_bookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Contact Forms</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_contacts}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'contacts'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Contacts ({contacts.length})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest 5 booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.slice(0, 5).length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">{booking.name}</p>
                          <p className="text-sm text-slate-600">
                            {getServiceName(booking.service_type)} - {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Contact Forms</CardTitle>
                <CardDescription>Latest 5 contact submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.slice(0, 5).length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No contact forms yet</p>
                ) : (
                  <div className="space-y-4">
                    {contacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">{contact.name}</p>
                          <span className="text-xs text-slate-600">
                            {format(new Date(contact.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{contact.email}</p>
                        <p className="text-sm text-slate-700 mt-2">{contact.message || 'No message'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {/* Filter */}
            <div className="mb-6 flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  className={filterStatus === status ? 'bg-slate-900' : ''}
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-slate-600 text-center">No bookings found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {booking.name}</p>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Phone:</strong> {booking.phone}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Service:</strong> {getServiceName(booking.service_type)}</p>
                            <p><strong>Package:</strong> {booking.package_type?.replace('-', ' ').toUpperCase() || 'N/A'}</p>
                            <p><strong>Date:</strong> {format(new Date(booking.booking_date), 'MMM dd, yyyy hh:mm a')}</p>
                            <p><strong>Duration:</strong> {booking.duration_hours} hours</p>
                            {booking.pickup_location && (
                              <p><strong>Pickup:</strong> {booking.pickup_location}</p>
                            )}
                            {booking.dropoff_location && (
                              <p><strong>Drop-off:</strong> {booking.dropoff_location}</p>
                            )}
                            {booking.message && (
                              <p><strong>Message:</strong> {booking.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">Status:</span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Confirm
                              </Button>
                              <Button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-slate-600 text-center">No contact forms yet</p>
                </CardContent>
              </Card>
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {contact.name}</p>
                          <p><strong>Email:</strong> {contact.email}</p>
                          <p><strong>Phone:</strong> {contact.phone || 'Not provided'}</p>
                          <p><strong>Service Interest:</strong> {getServiceName(contact.service)}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Message</h3>
                        <p className="text-sm text-slate-700">
                          {contact.message || 'No message provided'}
                        </p>
                        <p className="text-xs text-slate-600 mt-4">
                          Submitted: {format(new Date(contact.created_at), 'MMM dd, yyyy hh:mm a')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
