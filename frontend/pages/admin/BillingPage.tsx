import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  Receipt, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Download, 
  Plus, 
  Edit, 
  Users, 
  Building2, 
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';
import { AnimatedCard, AnimatedButton, AnimatedModal, AnimatedInput, AnimatedBadge, AnimatedChart, AnimatedIcon } from '../../components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface BillingRecord {
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  invoiceNumber: string;
  department: string;
  doctor: string;
}

export function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  const billingRecords: BillingRecord[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      service: 'Cardiology Consultation',
      amount: 250.00,
      status: 'paid',
      dueDate: '2024-02-15',
      paidDate: '2024-02-14',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-2024-001',
      department: 'Cardiology',
      doctor: 'Dr. Michael Chen'
    },
    {
      id: '2',
      patientName: 'David Wilson',
      patientId: 'P002',
      service: 'Dermatology Treatment',
      amount: 180.00,
      status: 'pending',
      dueDate: '2024-02-20',
      invoiceNumber: 'INV-2024-002',
      department: 'Dermatology',
      doctor: 'Dr. Emily Davis'
    },
    {
      id: '3',
      patientName: 'Lisa Brown',
      patientId: 'P003',
      service: 'Emergency Room Visit',
      amount: 450.00,
      status: 'overdue',
      dueDate: '2024-02-10',
      invoiceNumber: 'INV-2024-003',
      department: 'Emergency',
      doctor: 'Dr. Robert Smith'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'billing', label: 'Billing Records', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Financial Reports', icon: FileText }
  ];

  const subPages = [
    { id: 'invoices', label: 'Invoices', icon: Receipt, active: false },
    { id: 'patient-records', label: 'Patient & Records', icon: Users, active: false }
  ];

  const chartData = [
    { label: 'Jan', revenue: 80000, outstanding: 12000, collected: 68000 },
    { label: 'Feb', revenue: 92000, outstanding: 15000, collected: 77000 },
    { label: 'Mar', revenue: 98000, outstanding: 18000, collected: 80000 },
    { label: 'Apr', revenue: 110000, outstanding: 22000, collected: 88000 },
    { label: 'May', revenue: 125000, outstanding: 25000, collected: 100000 },
    { label: 'Jun', revenue: 138000, outstanding: 28000, collected: 110000 }
  ];

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'cancelled': return 'gray';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const openRecordModal = (record: BillingRecord) => {
    setSelectedRecord(record);
    setIsRecordModalOpen(true);
  };

  const totalRevenue = billingRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = billingRecords.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.amount, 0);
  const totalOutstanding = totalRevenue - totalPaid;
  const collectionRate = (totalPaid / totalRevenue) * 100;

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
        <Sparkles className="w-20 h-20" />
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
                Billing & Finance
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Manage billing records, track payments, and monitor financial performance
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setIsNewInvoiceModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Sub-pages Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <AnimatedCard className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex space-x-2">
              {subPages.map((page) => (
                <motion.button
                  key={page.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    page.active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </motion.button>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">$124,563</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+12.5% from last month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Pending Payments</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">$23,450</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">8 invoices pending</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Total Invoices</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">1,247</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">+5.2% from last month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-lg">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">Overdue</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">$8,920</p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">3 invoices overdue</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </AnimatedCard>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <AnimatedCard className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Content Based on Active Tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <>
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue vs Outstanding Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Revenue vs Outstanding
                      </h3>
                      <AnimatedBadge variant="success" size="sm">
                        +12.5%
                      </AnimatedBadge>
                    </div>
                    <AnimatedChart
                      type="line"
                      data={chartData.map(d => ({ label: d.label, value: d.revenue }))}
                      height={300}
                      className="w-full"
                    />
                  </AnimatedCard>
                </motion.div>

                {/* Collection Rate Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Collection Rate
                      </h3>
                      <AnimatedBadge variant="info" size="sm">
                        {collectionRate.toFixed(1)}%
                      </AnimatedBadge>
                    </div>
                    <AnimatedChart
                      type="doughnut"
                      data={[
                        { label: 'Collected', value: totalPaid },
                        { label: 'Outstanding', value: totalOutstanding }
                      ]}
                      height={300}
                      className="w-full"
                    />
                  </AnimatedCard>
                </motion.div>
              </div>
            </>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
                    Billing Records
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Patient</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Due Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => {
                        const StatusIcon = getStatusIcon(record.status);
                        return (
                          <tr
                            key={record.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                            onClick={() => openRecordModal(record)}
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{record.patientName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {record.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{record.service}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.department}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(record.amount)}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <AnimatedBadge
                                variant={getStatusColor(record.status) as any}
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="capitalize">{record.status}</span>
                              </AnimatedBadge>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-gray-900 dark:text-white">{record.dueDate}</p>
                            </td>
                            <td className="py-3 px-4">
                              <AnimatedButton
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRecordModal(record);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </AnimatedButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Payment Methods & Transactions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { method: 'Credit Card', count: 45, total: 45600, icon: CreditCard, color: 'blue' },
                    { method: 'Insurance', count: 23, total: 23400, icon: FileText, color: 'green' },
                    { method: 'Cash', count: 12, total: 8900, icon: DollarSign, color: 'emerald' },
                    { method: 'Bank Transfer', count: 8, total: 15600, icon: Building2, color: 'purple' },
                    { method: 'Debit Card', count: 15, total: 12300, icon: CreditCard, color: 'indigo' }
                  ].map((payment, index) => (
                    <motion.div
                      key={payment.method}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${payment.color}-100 dark:bg-${payment.color}-900/20 flex items-center justify-center`}>
                        <payment.icon className={`w-6 h-6 text-${payment.color}-600`} />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-center mb-2">
                        {payment.method}
                      </h4>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {payment.count} transactions
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(payment.total)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <AnimatedCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Financial Reports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Monthly Revenue Report', icon: DollarSign, color: 'green', format: 'PDF' },
                    { title: 'Outstanding Payments Report', icon: AlertCircle, color: 'red', format: 'Excel' },
                    { title: 'Collection Rate Analysis', icon: BarChart3, color: 'blue', format: 'CSV' },
                    { title: 'Payment Method Summary', icon: CreditCard, color: 'purple', format: 'PDF' },
                    { title: 'Department Performance', icon: Building2, color: 'orange', format: 'Excel' },
                    { title: 'Year-over-Year Comparison', icon: TrendingUp, color: 'indigo', format: 'PDF' }
                  ].map((report, index) => (
                    <motion.div
                      key={report.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${report.color}-100 dark:bg-${report.color}-900/20 flex items-center justify-center`}>
                        <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-center mb-2">
                        {report.title}
                      </h4>
                      <div className="flex items-center justify-center space-x-2">
                        <AnimatedBadge variant="secondary" size="sm">
                          {report.format}
                        </AnimatedBadge>
                        <AnimatedButton size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* New Invoice Modal */}
      <AnimatedModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        title="Create New Invoice"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Patient Name *
              </label>
              <AnimatedInput
                type="text"
                placeholder="Enter patient name"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Patient ID *
              </label>
              <AnimatedInput
                type="text"
                placeholder="Enter patient ID"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Service/Procedure *
              </label>
              <AnimatedInput
                type="text"
                placeholder="Enter service description"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Department *
              </label>
              <AnimatedInput
                type="text"
                placeholder="Enter department"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Doctor/Provider *
              </label>
              <AnimatedInput
                type="text"
                placeholder="Enter doctor name"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <AnimatedInput
                type="number"
                placeholder="0.00"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <AnimatedInput
                type="date"
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4">
                <option value="">Select payment method</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="cash">Cash</option>
                <option value="insurance">Insurance</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              placeholder="Enter any additional notes or special instructions"
              rows={3}
              className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <AnimatedButton
              variant="outline"
              onClick={() => setIsNewInvoiceModalOpen(false)}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>

      {/* Record Detail Modal */}
      <AnimatedModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={`Billing Record - ${selectedRecord?.invoiceNumber}`}
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient Information
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedRecord.patientName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {selectedRecord.patientId}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Details
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedRecord.service}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRecord.department} • {selectedRecord.doctor}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Financial Information
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedRecord.amount)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invoice: {selectedRecord.invoiceNumber}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status & Dates
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AnimatedBadge
                      variant={getStatusColor(selectedRecord.status) as any}
                      size="lg"
                    >
                      {selectedRecord.status}
                    </AnimatedBadge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {selectedRecord.dueDate}
                  </p>
                  {selectedRecord.paidDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paid: {selectedRecord.paidDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {selectedRecord.paymentMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {selectedRecord.paymentMethod}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4">
              <AnimatedButton
                variant="outline"
                onClick={() => setIsRecordModalOpen(false)}
              >
                Close
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Record
              </AnimatedButton>
            </div>
          </div>
        )}
      </AnimatedModal>
    </div>
  );
}
