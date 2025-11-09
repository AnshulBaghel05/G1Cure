import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, Eye, Edit, Trash2, Shield, 
  User, UserCheck, UserX, Mail, Phone, Calendar, Building2, 
  CheckCircle, AlertCircle, Clock, MoreVertical, Download,
  Zap, Target, Brain, Sparkles, Plus, Settings, BarChart3
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin' | 'nurse';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  lastLogin: string;
  createdAt: string;
  isVerified: boolean;
}

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const users: User[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@g1cure.com',
      phone: '+1 (555) 123-4567',
      role: 'doctor',
      status: 'active',
      department: 'Cardiology',
      lastLogin: '2024-02-20 10:30 AM',
      createdAt: '2023-01-15',
      isVerified: true
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@g1cure.com',
      phone: '+1 (555) 234-5678',
      role: 'doctor',
      status: 'active',
      department: 'Dermatology',
      lastLogin: '2024-02-20 09:15 AM',
      createdAt: '2023-02-20',
      isVerified: true
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@g1cure.com',
      phone: '+1 (555) 345-6789',
      role: 'nurse',
      status: 'active',
      department: 'Emergency',
      lastLogin: '2024-02-20 08:45 AM',
      createdAt: '2023-03-10',
      isVerified: true
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return UserCheck;
      case 'nurse': return User;
      case 'admin': return Shield;
      case 'patient': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'blue';
      case 'nurse': return 'green';
      case 'admin': return 'purple';
      case 'patient': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'danger';
      default: return 'warning';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const verifiedUsers = users.filter(u => u.isVerified).length;

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating 3D Icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-20 text-blue-400/30 dark:text-blue-300/30"
      >
        <Brain className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 left-20 text-emerald-400/30 dark:text-emerald-300/30"
      >
        <Target className="w-20 h-20" />
      </motion.div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Manage all users, roles, and access controls
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Users
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setIsUserModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add User
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { title: 'Total Users', value: totalUsers, icon: Users, color: 'blue', description: 'All registered users' },
            { title: 'Active Users', value: activeUsers, icon: UserCheck, color: 'green', description: 'Currently active' },
            { title: 'Verified Users', value: verifiedUsers, icon: CheckCircle, color: 'purple', description: 'Email verified' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <AnimatedCard
                className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                hoverEffect="lift"
                entranceAnimation="slideUp"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 dark:from-${stat.color}-900/30 dark:to-${stat.color}-800/30`}>
                    <AnimatedIcon 
                      size="xl" 
                      animation="pulse" 
                      color={`var(--color-${stat.color}-600)`}
                    >
                      <stat.icon className="w-8 h-8" />
                    </AnimatedIcon>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {stat.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Sub-pages Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <AnimatedCard className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'all-users', label: 'All Users', icon: Users, active: true },
                { id: 'add-users', label: 'Add Users', icon: UserPlus, active: false },
                { id: 'sub-admins', label: 'Sub Admins', icon: Shield, active: false }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    tab.active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <AnimatedCard 
            className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
            hoverEffect="glow"
            entranceAnimation="slideUp"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <AnimatedInput
                    type="text"
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full h-12 text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="doctor">Doctors</option>
                    <option value="nurse">Nurses</option>
                    <option value="admin">Admins</option>
                    <option value="patient">Patients</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <AnimatedCard 
                className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                hoverEffect="glow"
                entranceAnimation="slideLeft"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-400 to-gray-400 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                        <AnimatedBadge
                          variant={getStatusColor(user.status) as any}
                          size="sm"
                        >
                          {user.status}
                        </AnimatedBadge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>{user.department || 'No Department'}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full bg-${getRoleColor(user.role)}-100 dark:bg-${getRoleColor(user.role)}-900/20 flex items-center justify-center`}>
                              {(() => {
                                const IconComponent = getRoleIcon(user.role);
                                return <IconComponent className={`w-3 h-3 text-${getRoleColor(user.role)}-600`} />;
                              })()}
                            </div>
                            <AnimatedBadge
                              variant="outline"
                              size="sm"
                              className={`border-${getRoleColor(user.role)}-600 text-${getRoleColor(user.role)}-600`}
                            >
                              {user.role}
                            </AnimatedBadge>
                          </div>
                          {user.isVerified && (
                            <AnimatedBadge variant="success" size="sm">
                              Verified
                            </AnimatedBadge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                      onClick={() => openUserModal(user)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </AnimatedButton>
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </AnimatedButton>
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      className="border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* User Detail Modal */}
        <AnimatedModal
          isOpen={isUserModalOpen && !!selectedUser}
          onClose={() => setIsUserModalOpen(false)}
          title={`User Details - ${selectedUser?.firstName} ${selectedUser?.lastName}`}
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role & Status
                  </label>
                  <div className="flex items-center space-x-3">
                    <AnimatedBadge
                      variant={getStatusColor(selectedUser.status) as any}
                      size="lg"
                    >
                      {selectedUser.status}
                    </AnimatedBadge>
                    <AnimatedBadge
                      variant="outline"
                      size="lg"
                      className={`border-${getRoleColor(selectedUser.role)}-600 text-${getRoleColor(selectedUser.role)}-600`}
                    >
                      {selectedUser.role}
                    </AnimatedBadge>
                    {selectedUser.isVerified && (
                      <AnimatedBadge variant="success" size="lg">
                        Verified
                      </AnimatedBadge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Information
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {selectedUser.department}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Login
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.lastLogin}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Created
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Close
                </AnimatedButton>
                <AnimatedButton
                  className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </AnimatedButton>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* Add User Modal */}
        <AnimatedModal
          isOpen={isUserModalOpen && !selectedUser}
          onClose={() => setIsUserModalOpen(false)}
          title="Add New User"
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <AnimatedInput
                  type="text"
                  placeholder="Enter first name"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <AnimatedInput
                  type="text"
                  placeholder="Enter last name"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <AnimatedInput
                  type="email"
                  placeholder="Enter email address"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <AnimatedInput
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <select className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Select role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Select department</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="emergency">Emergency</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <AnimatedInput
                  type="password"
                  placeholder="Enter password"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <AnimatedInput
                  type="password"
                  placeholder="Confirm password"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send welcome email
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Require email verification
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <AnimatedButton
                variant="outline"
                onClick={() => setIsUserModalOpen(false)}
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </AnimatedButton>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </div>
  );
}
