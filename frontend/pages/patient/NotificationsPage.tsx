import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle, AlertCircle, Info, X,
  Calendar, Clock, User, Stethoscope, Heart,
  MessageSquare, FileText, Download, Star, Eye
} from 'lucide-react';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBackendClient } from '../../lib/backend';

interface Notification {
  id: string;
  type: 'appointment' | 'medical' | 'billing' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: string;
  actionUrl?: string;
  icon?: string;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const backend = useBackendClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Since there's no notifications endpoint, we'll generate notifications based on other data
        const [appointmentsResponse, billsResponse] = await Promise.all([
          backend.clinic.listAppointments({
            patientId: user.profile_id || user.id,
            limit: 10
          }),
          backend.clinic.listBills({
            patientId: user.profile_id || user.id,
            limit: 10
          })
        ]);

        // Generate notifications based on appointments and bills
        const generatedNotifications: Notification[] = [];

        // Add appointment notifications
        appointmentsResponse.appointments.forEach(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          const now = new Date();
          const timeDiff = appointmentDate.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff === 1) {
            generatedNotifications.push({
              id: `appointment-${appointment.id}`,
              type: 'appointment' as const,
              title: 'Appointment Reminder',
              message: `Your appointment is scheduled for tomorrow at ${appointmentDate.toLocaleTimeString()}.`,
              timestamp: new Date().toISOString(),
              isRead: false,
              priority: 'high' as const,
              action: 'View Details',
              actionUrl: '/patient/appointments'
            });
          }
        });

        // Add billing notifications
        billsResponse.bills.forEach(bill => {
          if (bill.status === 'pending') {
            const dueDate = new Date(bill.dueDate);
            const now = new Date();
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff <= 7) {
              generatedNotifications.push({
                id: `billing-${bill.id}`,
                type: 'billing' as const,
                title: 'Payment Due',
                message: `You have a payment of $${bill.amount} due ${daysDiff > 0 ? `in ${daysDiff} days` : 'today'}.`,
                timestamp: new Date().toISOString(),
                isRead: false,
                priority: daysDiff <= 3 ? 'high' as const : 'medium' as const,
                action: 'Pay Now',
                actionUrl: '/patient/billing'
              });
            }
          }
        });

        // Add some system notifications
        generatedNotifications.push({
          id: 'system-1',
          type: 'system' as const,
          title: 'Welcome to G1Cure',
          message: 'Thank you for using G1Cure. Your health is our priority.',
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'low' as const,
          action: 'Learn More',
          actionUrl: '/patient/help'
        });

        setNotifications(generatedNotifications);

      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications. Please try again.');
        
        // Fallback to mock data if API fails
        const fallbackNotifications = [
          {
            id: '1',
            type: 'appointment' as const,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Sarah Johnson is scheduled for tomorrow at 10:00 AM.',
            timestamp: '2024-01-19T08:00:00Z',
            isRead: false,
            priority: 'high' as const,
            action: 'View Details',
            actionUrl: '/appointments'
          },
          {
            id: '2',
            type: 'medical' as const,
            title: 'Lab Results Available',
            message: 'Your recent blood test results are now available in your medical records.',
            timestamp: '2024-01-18T14:30:00Z',
            isRead: false,
            priority: 'medium' as const,
            action: 'View Results',
            actionUrl: '/medical-records'
          },
          {
            id: '3',
            type: 'billing' as const,
            title: 'Payment Due',
            message: 'You have a payment of $150.00 due in 3 days.',
            timestamp: '2024-01-17T10:00:00Z',
            isRead: false,
            priority: 'high' as const,
            action: 'Pay Now',
            actionUrl: '/billing'
          }
        ];

        setNotifications(fallbackNotifications);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, backend]);

  // Mock mark as read functions
  const markAsReadMutation = {
    mutateAsync: async (notificationId: string) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Marking notification as read:', notificationId);
      return { success: true };
    },
    isPending: false
  };

  const markAllAsReadMutation = {
    mutateAsync: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Marking all notifications as read');
      return { success: true };
    },
    isPending: false
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'medical': return Stethoscope;
      case 'billing': return FileText;
      case 'system': return Info;
      case 'reminder': return Heart;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-orange-500 to-yellow-500';
      case 'low': return 'from-blue-500 to-indigo-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'from-blue-500 to-indigo-500';
      case 'medical': return 'from-emerald-500 to-teal-500';
      case 'billing': return 'from-purple-500 to-pink-500';
      case 'system': return 'from-slate-500 to-slate-600';
      case 'reminder': return 'from-orange-500 to-red-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read. Please try again.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      alert('All notifications marked as read!');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Failed to mark all notifications as read. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Notifications</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-20"
        >
          <Bell className="text-blue-400" />
        </div>
        <div
          className="absolute top-40 right-20 text-5xl opacity-10 dark:opacity-20"
        >
          <AlertCircle className="text-purple-400" />
        </div>
        <div
          className="absolute bottom-40 left-20 text-4xl opacity-10 dark:opacity-20"
        >
          <CheckCircle className="text-emerald-400" />
        </div>
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Enhanced Header */}
        <div
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
              >
                Notifications
              </h1>
              <p 
                className="text-xl text-slate-600 dark:text-slate-300 mt-3"
              >
                Stay updated with your healthcare information and important reminders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={markAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark All Read'}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              title: 'Unread Notifications', 
              value: unreadCount.toString(), 
              icon: Bell, 
              color: 'from-blue-500 to-indigo-500',
              change: `${unreadCount} new`
            },
            { 
              title: 'High Priority', 
              value: highPriorityCount.toString(), 
              icon: AlertCircle, 
              color: 'from-red-500 to-pink-500',
              change: 'Requires attention'
            },
            { 
              title: 'Total Notifications', 
              value: notifications.length.toString(), 
              icon: CheckCircle, 
              color: 'from-emerald-500 to-teal-500',
              change: 'All time'
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-400`}>
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Search and Filters */}
        <div
          className="mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  <option value="appointment">Appointments</option>
                  <option value="medical">Medical</option>
                  <option value="billing">Billing</option>
                  <option value="system">System</option>
                  <option value="reminder">Reminders</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notifications List */}
        <div
          className="space-y-6"
        >
          {notificationsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notificationsError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                Error loading notifications
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No notifications found
              </p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'You have no notifications at the moment'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`relative group ${!notification.isRead ? 'ring-2 ring-blue-500/20' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${getTypeColor(notification.type)} flex items-center justify-center shadow-lg`}>
                      {React.createElement(getTypeIcon(notification.type), { className: "w-7 h-7 text-white" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className={`text-xl font-bold ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {notification.title}
                        </h3>
                        <div className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(notification.priority)} text-white rounded-full text-sm font-medium shadow-lg`}>
                          {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                        </div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className={`text-slate-600 dark:text-slate-400 mb-3 ${!notification.isRead ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTypeColor(notification.type)}`} />
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {notification.action && (
                            <button
                              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                            >
                              {notification.action}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedNotification(notification);
                              setIsModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </button>
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {markAsReadMutation.isPending ? 'Marking...' : 'Mark Read'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Notification Detail Modal */}
      <div className={`fixed inset-0 z-50 ${isModalOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">×</button>
            </div>
            <div className="p-6">
        {selectedNotification && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(selectedNotification.type)} flex items-center justify-center`}>
                    {React.createElement(getTypeIcon(selectedNotification.type), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 capitalize">{selectedNotification.type}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {formatTimestamp(selectedNotification.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getPriorityColor(selectedNotification.priority)}`} />
                    <span className="text-slate-700 dark:text-slate-300">
                      Priority: {selectedNotification.priority.charAt(0).toUpperCase() + selectedNotification.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Status</h4>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedNotification.isRead 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {selectedNotification.isRead ? 'Read' : 'Unread'}
                  </div>
                </div>
                {selectedNotification.action && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Action Required</h4>
                    <p className="text-slate-700 dark:text-slate-300">{selectedNotification.action}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Message</h4>
              <p className="text-slate-700 dark:text-slate-300">{selectedNotification.message}</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
              >
                Close
              </button>
              {!selectedNotification.isRead && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Read
                </button>
              )}
              {selectedNotification.action && (
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                >
                  {selectedNotification.action}
                </button>
              )}
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
