import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Receipt, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Lock,
  CreditCard as CardIcon,
  Banknote,
  QrCode,
  Send,
  Copy,
  ExternalLink,
  User
} from 'lucide-react';
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedIcon, 
  AnimatedBadge, 
  AnimatedInput,
  AnimatedModal,
  AnimatedProgress
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBackendClient } from '../../lib/backend';

interface Bill {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'disputed';
  type: 'consultation' | 'procedure' | 'medication' | 'lab-work' | 'imaging';
  description: string;
  insurance?: string;
  insuranceCoverage?: number;
  patientResponsibility: number;
  provider: string;
  invoiceNumber: string;
  items?: BillItem[];
}

interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description?: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'debit-card' | 'bank-transfer' | 'digital-wallet';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export function BillingPage() {
  const { user } = useAuth();
  const backend = useBackendClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Load bills from backend
        const billsResponse = await backend.clinic.listBills({
          patientId: user.profile_id || user.id,
          limit: 100
        });

        // Transform backend bills to our Bill interface
        const transformedBills: Bill[] = billsResponse.bills.map(bill => ({
          id: bill.id,
          date: bill.createdAt,
          dueDate: bill.dueDate,
          amount: bill.amount,
          status: bill.status as 'paid' | 'pending' | 'overdue' | 'disputed',
          type: 'consultation' as const, // Default type, could be enhanced
          description: `Bill for appointment ${bill.appointmentId}`,
          insurance: 'Blue Cross Blue Shield',
          provider: 'G1Cure Medical Center',
          paymentMethod: bill.paymentMethod || 'Credit Card',
          paidAt: bill.paidAt,
          notes: 'Standard consultation fee'
        }));

        setBills(transformedBills);

      } catch (err) {
        console.error('Error loading bills:', err);
        setError('Failed to load billing information. Please try again.');
        
        // Fallback to mock data if API fails
        const fallbackBills = [
          {
            id: '1',
            date: '2024-01-15',
            dueDate: '2024-02-15',
            amount: 150.00,
            status: 'paid' as const,
            type: 'consultation' as const,
            description: 'General consultation with Dr. Smith',
            insurance: 'Blue Cross Blue Shield',
            provider: 'G1Cure Medical Center',
            paymentMethod: 'Credit Card',
            paidAt: '2024-01-20',
            notes: 'Standard consultation fee'
          },
          {
            id: '2',
            date: '2024-01-20',
            dueDate: '2024-02-20',
            amount: 75.00,
            status: 'pending' as const,
            type: 'lab-work' as const,
            description: 'Blood test and lab work',
            insurance: 'Blue Cross Blue Shield',
            provider: 'LabCorp',
            paymentMethod: 'Credit Card',
            paidAt: null,
            notes: 'Lab work for routine checkup'
          }
        ];

        setBills(fallbackBills);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, backend]);

  const paymentMethods = [
    {
      id: '1',
      type: 'credit-card' as const,
      name: 'Visa ending in 1234',
      last4: '1234',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'debit-card' as const,
      name: 'Mastercard ending in 5678',
      last4: '5678',
      expiryDate: '08/26',
      isDefault: false
    }
  ];


  // Mock process payment function
  const processPaymentMutation = {
    mutateAsync: async (paymentData: any) => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Processing payment:', paymentData);
      return { success: true, transactionId: 'TXN-' + Date.now() };
    },
    isPending: false
  };

  const totalOutstanding = bills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.patientResponsibility, 0);

  const totalPaid = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.patientResponsibility, 0);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return User;
      case 'procedure': return FileText;
      case 'medication': return Receipt;
      case 'lab-work': return TrendingUp;
      case 'imaging': return Eye;
      default: return FileText;
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit-card': return CreditCard;
      case 'debit-card': return Banknote;
      case 'bank-transfer': return Wallet;
      case 'digital-wallet': return QrCode;
      default: return CreditCard;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openBillModal = (bill: Bill) => {
    setSelectedBill(bill);
    setIsBillModalOpen(true);
  };

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPaymentMethod || !paymentAmount) {
      alert('Please select a payment method and enter an amount');
      return;
    }

    try {
      await processPaymentMutation.mutateAsync({
        billId: selectedBill?.id,
        amount: parseFloat(paymentAmount),
        paymentMethodId: selectedPaymentMethod,
        patientId: user!.profile_id
      });
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading billing information...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Billing</h2>
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
      <div className="relative z-10 space-y-8 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
              >
                Billing & Payments
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-slate-600 dark:text-slate-300 mt-3"
              >
                Manage your medical bills and payment methods
              </motion.p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AnimatedButton
                onClick={openPaymentModal}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Make Payment
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              title: 'Outstanding Balance', 
              value: formatCurrency(totalOutstanding), 
              icon: AlertCircle, 
              color: 'from-red-500 to-pink-500'
            },
            { 
              title: 'Total Paid', 
              value: formatCurrency(totalPaid), 
              icon: CheckCircle, 
              color: 'from-emerald-500 to-teal-500'
            },
            { 
              title: 'Next Due', 
              value: formatCurrency(50.00), 
              icon: Clock, 
              color: 'from-orange-500 to-yellow-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bills List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {billsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
          ) : billsError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                Error loading bills
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Receipt className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No bills found
              </p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'You have no outstanding bills'}
              </p>
            </div>
          ) : (
            filteredBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.01, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        {React.createElement(getTypeIcon(bill.type), { className: "w-7 h-7 text-white" })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {bill.description}
                          </h3>
                          <div className={`px-3 py-1 bg-gradient-to-r ${
                            bill.status === 'paid' ? 'from-emerald-500 to-teal-500' :
                            bill.status === 'pending' ? 'from-blue-500 to-indigo-500' :
                            bill.status === 'overdue' ? 'from-red-500 to-pink-500' :
                            'from-orange-500 to-yellow-500'
                          } text-white rounded-full text-sm font-medium shadow-lg`}>
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">Due: {formatDate(bill.dueDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="font-medium">Amount: {formatCurrency(bill.amount)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium">{bill.provider}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AnimatedButton
                        onClick={() => openBillModal(bill)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </AnimatedButton>
                      {bill.status === 'pending' && (
                        <AnimatedButton
                          onClick={openPaymentModal}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </AnimatedButton>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Bill Detail Modal */}
      <AnimatedModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        title="Bill Details"
        size="lg"
      >
        {selectedBill && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {React.createElement(getTypeIcon(selectedBill.type), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedBill.description}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{selectedBill.provider}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Date: {formatDate(selectedBill.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Due: {formatDate(selectedBill.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Amount</h4>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedBill.amount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
              <AnimatedButton
                onClick={() => setIsBillModalOpen(false)}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
              >
                Close
              </AnimatedButton>
              {(selectedBill.status === 'pending' || selectedBill.status === 'overdue') && (
                <AnimatedButton
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                  onClick={() => {
                    setIsBillModalOpen(false);
                    openPaymentModal();
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </AnimatedButton>
              )}
            </div>
          </div>
        )}
      </AnimatedModal>

      {/* Payment Modal */}
      <AnimatedModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Make Payment"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Payment Method
            </label>
            <select 
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Select payment method...</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Amount to Pay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="pl-8 w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <AnimatedButton
              onClick={() => setIsPaymentModalOpen(false)}
              className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleProcessPayment}
              disabled={processPaymentMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-4 h-4 mr-2" />
              {processPaymentMutation.isPending ? 'Processing...' : 'Process Payment'}
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}
