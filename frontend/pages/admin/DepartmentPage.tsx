import React, { useState } from 'react';
import {
  Building2, Users, Search, Filter, Eye, Edit, Trash2,
  Plus, Settings, Activity, TrendingUp, CheckCircle, AlertCircle,
  Clock, MapPin, Star, Award, BarChart3, Calendar, UserCheck,
  Zap, Target, Brain, Sparkles, Globe, Server, Cpu
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal, AnimatedProgress, AnimatedChart 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
  userCount: number;
  maxCapacity: number;
  budget: number;
  performance: number;
}

export function DepartmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

  const departments: Department[] = [
    {
      id: '1',
      name: 'Cardiology',
      description: 'Specialized care for heart and cardiovascular conditions',
      manager: 'Dr. Sarah Johnson',
      status: 'active',
      userCount: 8,
      maxCapacity: 12,
      budget: 250000,
      performance: 94.5
    },
    {
      id: '2',
      name: 'Dermatology',
      description: 'Treatment of skin, hair, and nail conditions',
      manager: 'Dr. Michael Chen',
      status: 'active',
      userCount: 5,
      maxCapacity: 8,
      budget: 180000,
      performance: 91.2
    },
    {
      id: '3',
      name: 'Emergency Medicine',
      description: '24/7 emergency care and trauma treatment',
      manager: 'Dr. Robert Smith',
      status: 'active',
      userCount: 12,
      maxCapacity: 15,
      budget: 350000,
      performance: 96.8
    }
  ];

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || department.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'maintenance': return 'danger';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return AlertCircle;
      case 'maintenance': return Clock;
      default: return Clock;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalStaff = departments.reduce((sum, dept) => sum + dept.userCount, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const avgPerformance = departments.reduce((sum, dept) => sum + dept.performance, 0) / departments.length;

  const openDepartmentModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentModalOpen(true);
  };

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
        <Target className="w-20 h-20" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Department Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Manage departments, staff, and monitor organizational performance
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setIsDepartmentModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Department
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Enhanced Department Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Departments', value: departments.length, icon: Building2, color: 'blue', description: 'Active departments' },
            { title: 'Total Staff', value: totalStaff, icon: Users, color: 'green', description: 'Department members' },
            { title: 'Total Budget', value: totalBudget, icon: Award, color: 'purple', description: 'Annual budget' },
            { title: 'Avg Performance', value: avgPerformance, icon: Star, color: 'yellow', description: 'Performance score' }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="hover:scale-105 hover:-translate-y-2 transition-transform duration-300"
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
                      {stat.title.includes('Performance') ? `${stat.value.toFixed(1)}%` :
                       stat.title.includes('Budget') ? formatCurrency(stat.value) :
                       stat.value}
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
            </div>
          ))}
        </div>

        {/* Sub-pages Navigation Tabs */}
        <div className="mb-8">
          <AnimatedCard className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'departments', label: 'Departments', icon: Building2, active: true },
                { id: 'appointments', label: 'All Appointments', icon: Calendar, active: false },
                { id: 'schedule', label: 'Schedule Management', icon: Clock, active: false },
                { id: 'waitlist', label: 'Waitlist', icon: UserCheck, active: false }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-102 ${
                    tab.active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8">
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
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full h-12 text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Departments List */}
        <div className="space-y-6">
          {filteredDepartments.map((department, index) => (
            <div
              key={department.id}
              className="hover:scale-[1.01] hover:translate-x-1 transition-all duration-300"
            >
              <AnimatedCard 
                className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                hoverEffect="glow"
                entranceAnimation="slideLeft"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
                      <AnimatedIcon
                        size="lg"
                        animation="pulse"
                        color="var(--color-blue-600)"
                      >
                        <Building2 className="w-6 h-6" />
                      </AnimatedIcon>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {department.name}
                        </h3>
                        <AnimatedBadge
                          variant={getStatusColor(department.status) as any}
                          size="sm"
                        >
                          {department.status}
                        </AnimatedBadge>
                        <AnimatedBadge variant="secondary" size="sm">
                          {department.userCount}/{department.maxCapacity} Staff
                        </AnimatedBadge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {department.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{department.manager}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4" />
                          <span>{department.performance}% Performance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4" />
                          <span>{formatCurrency(department.budget)}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Budget: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(department.budget)}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <AnimatedProgress
                              value={(department.userCount / department.maxCapacity) * 100}
                              size="sm"
                              variant="gradient"
                              className="mb-2"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Capacity: {department.userCount}/{department.maxCapacity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                      onClick={() => openDepartmentModal(department)}
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
            </div>
          ))}
        </div>

        {/* Department Detail Modal */}
        <AnimatedModal
          isOpen={isDepartmentModalOpen && !!selectedDepartment}
          onClose={() => setIsDepartmentModalOpen(false)}
          title={`Department Details - ${selectedDepartment?.name}`}
          size="lg"
        >
          {selectedDepartment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department Information
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedDepartment.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDepartment.description}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status & Performance
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AnimatedBadge
                        variant={getStatusColor(selectedDepartment.status) as any}
                        size="lg"
                      >
                        {selectedDepartment.status}
                      </AnimatedBadge>
                      <AnimatedBadge variant="success" size="lg">
                        {selectedDepartment.performance}%
                      </AnimatedBadge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Manager
                  </label>
                  <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {selectedDepartment.manager}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Staff & Budget
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-white font-medium">
                      Staff: {selectedDepartment.userCount}/{selectedDepartment.maxCapacity}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Budget: {formatCurrency(selectedDepartment.budget)}
                    </p>
                    <div className="mt-2">
                      <AnimatedProgress
                        value={(selectedDepartment.userCount / selectedDepartment.maxCapacity) * 100}
                        size="sm"
                        variant="gradient"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsDepartmentModalOpen(false)}
                >
                  Close
                </AnimatedButton>
                <AnimatedButton
                  className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Department
                </AnimatedButton>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* New Department Modal */}
        <AnimatedModal
          isOpen={isDepartmentModalOpen && !selectedDepartment}
          onClose={() => setIsDepartmentModalOpen(false)}
          title="Create New Department"
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Department Name *
                </label>
                <AnimatedInput
                  type="text"
                  placeholder="Enter department name"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Department Manager *
                </label>
                <AnimatedInput
                  type="text"
                  placeholder="Enter manager name"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Enter department description"
                rows={3}
                className="w-full h-24 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Capacity *
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="Enter max staff capacity"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Budget *
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="Enter annual budget"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Initial Status
                </label>
                <select className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <AnimatedInput
                  type="text"
                  placeholder="Enter department location"
                  className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <AnimatedInput
                  type="email"
                  placeholder="Enter contact email"
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
                  Send notification to manager
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Create default roles
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <AnimatedButton
                variant="outline"
                onClick={() => setIsDepartmentModalOpen(false)}
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </AnimatedButton>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </div>
  );
}
