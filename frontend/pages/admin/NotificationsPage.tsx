import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Settings,
  Trash2,
  Archive,
  Filter,
  Search,
  Brain,
  Sparkles
} from 'lucide-react';
import { AnimatedCard, AnimatedButton, AnimatedBadge, AnimatedInput } from '../../components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'user' | 'billing' | 'security' | 'maintenance';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. Some services may be temporarily unavailable.',
      type: 'info',
      category: 'maintenance',
      timestamp: '2024-02-15T10:30:00Z',
      isRead: false,
      priority: 'medium',
      actionRequired: false
    },
    {
      id: '2',
      title: 'New User Registration',
      message: 'Dr. Sarah Johnson has completed registration and requires admin approval for access to the cardiology department.',
      type: 'success',
      category: 'user',
      timestamp: '2024-02-15T09:15:00Z',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Payment Overdue Alert',
      message: 'Invoice INV-2024-003 for Lisa Brown is now 5 days overdue. Amount: $450.00',
      type: 'warning',
      category: 'billing',
      timestamp: '2024-02-15T08:45:00Z',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP address 192.168.1.100. Account temporarily locked.',
      type: 'error',
      category: 'security',
      timestamp: '2024-02-15T07:20:00Z',
      isRead: true,
      priority: 'urgent',
      actionRequired: true
    },
    {
      id: '5',
      title: 'Database Backup Completed',
      message: 'Daily database backup completed successfully. Backup size: 2.3 GB. Retention: 30 days.',
      type: 'success',
      category: 'system',
      timestamp: '2024-02-15T06:00:00Z',
      isRead: true,
      priority: 'low',
      actionRequired: false
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRead, setShowRead] = useState(true);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'info': return 'info';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return XCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRead = showRead || !notification.isRead;
    
    return matchesType && matchesCategory && matchesPriority && matchesSearch && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 right-20 text-blue-400/30 dark:text-blue-300/30">
        <Brain className="w-16 h-16" />
      </div>

      <div className="absolute bottom-20 left-20 text-emerald-400/30 dark:text-emerald-300/30">
        <Sparkles className="w-20 h-20" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Notifications Center
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Manage system alerts, user notifications, and administrative messages
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
                onClick={markAllAsRead}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Notification Settings
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Total Notifications</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{notifications.length}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">All time</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-lg">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Unread</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">{unreadCount}</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Requires attention</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg">
                  <BellOff className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">Urgent</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{urgentCount}</p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Immediate action</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Action Required</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{actionRequiredCount}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Pending decisions</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Search Notifications
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <AnimatedInput
                    type="text"
                    placeholder="Search by title or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4"
                  >
                    <option value="all">All Types</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4"
                  >
                    <option value="all">All Categories</option>
                    <option value="system">System</option>
                    <option value="user">User</option>
                    <option value="billing">Billing</option>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showRead}
                    onChange={(e) => setShowRead(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show read notifications</span>
                </label>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNotifications.length} of {notifications.length} notifications
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => {
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <div
                key={notification.id}
                className="hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300"
              >
                <AnimatedCard 
                  className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                    !notification.isRead ? 'ring-2 ring-blue-500/20 shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-${getTypeColor(notification.type)}-100 dark:bg-${getTypeColor(notification.type)}-900/20 flex-shrink-0`}>
                      <TypeIcon className={`w-6 h-6 text-${getTypeColor(notification.type)}-600`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <AnimatedBadge
                              variant={getPriorityColor(notification.priority) as any}
                              size="sm"
                            >
                              {notification.priority}
                            </AnimatedBadge>
                            {notification.actionRequired && (
                              <AnimatedBadge variant="warning" size="sm">
                                Action Required
                              </AnimatedBadge>
                            )}
                          </div>
                          
                          <p className={`text-gray-600 dark:text-gray-400 mb-3 ${
                            notification.isRead ? 'text-gray-500 dark:text-gray-500' : ''
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatTimestamp(notification.timestamp)}</span>
                            <span className="capitalize">{notification.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <AnimatedButton
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </AnimatedButton>
                          )}
                          
                          <AnimatedButton
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
