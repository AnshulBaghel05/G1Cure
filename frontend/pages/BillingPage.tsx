import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Trash2, CreditCard, Calendar, User, Receipt, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BillForm } from '../components/BillForm';
import { getBills, getBillById, createBill, updateBill, processPayment, deleteBill } from '@/lib/api';
import backend from '~backend/client';
import type { Bill } from '~backend/clinic/billing';
import { useAuth } from '../contexts/AuthContext';

export function BillingPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const isPatient = user?.role === 'patient';

  const { data: billsData, isLoading, error } = useQuery({
    queryKey: ['bills', searchTerm, user?.id],
    queryFn: async () => {
      const params: { limit: number; patientId?: string; search?: string } = { limit: 100 };
      if (isPatient) {
        params.patientId = user.profile_id;
      }
      // Add search logic if needed
      return await getBills(params);
    },
    enabled: !!user,
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => await backend.clinic.listAppointments({ limit: 1000 }),
    enabled: !isPatient,
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => await backend.clinic.listPatients({ limit: 1000 }),
    enabled: !isPatient,
  });

  const deleteBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      await deleteBill(billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast({
        title: t('common.success'),
        description: 'Bill deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete bill error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to delete bill',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = async (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      deleteBillMutation.mutate(billId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBill(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['bills'] });
    handleFormClose();
    toast({
      title: t('common.success'),
      description: editingBill ? 'Bill updated successfully' : 'Bill created successfully',
    });
  };

  const getPatientName = (patientId: string) => {
    if (isPatient) return `${user?.first_name} ${user?.last_name}`;
    const patient = patientsData?.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{t('common.error')}: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('billing.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isPatient ? 'View your invoices and payment history' : 'Manage invoices and payment records'}
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={isPatient ? 'Search by invoice number or date...' : t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {billsData?.bills.map((bill, index) => (
            <div
              key={bill.id}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">
                          {bill.invoiceNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {!isPatient && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Patient:</span>
                        <span className="font-medium dark:text-white">{getPatientName(bill.patientId)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium dark:text-white">₹{bill.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                      <span className="dark:text-white">₹{bill.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Total:</span>
                      <span className="font-bold text-lg dark:text-white">₹{bill.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Due:</span>
                      <span className={new Date(bill.dueDate) < new Date() && bill.status === 'pending' ? 'text-red-600 dark:text-red-400 font-medium' : 'dark:text-white'}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {isPatient && bill.status === 'pending' && (
                      <Button size="sm" className="flex-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Pay Now
                      </Button>
                    )}
                    {!isPatient && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(bill)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(bill.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {billsData?.bills.length === 0 && !isLoading && (
        <div
          className="text-center py-12"
        >
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bills found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isPatient ? 'You have no outstanding or past bills.' : 'Bills will be automatically generated when appointments are created.'}
          </p>
        </div>
      )}

      {showForm && !isPatient && (
        <BillForm
          bill={editingBill}
          appointments={appointmentsData?.appointments || []}
          patients={patientsData?.patients || []}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
