import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';
import type { Bill, CreateBillRequest, UpdateBillRequest } from '~backend/clinic/billing';
import type { Appointment } from '~backend/clinic/appointment';
import type { Patient } from '~backend/clinic/patient';

interface BillFormProps {
  bill?: Bill | null;
  appointments: Appointment[];
  patients: Patient[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BillForm({ bill, appointments, patients, onClose, onSuccess }: BillFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!bill;

  const [formData, setFormData] = useState({
    appointmentId: bill?.appointmentId || '',
    patientId: bill?.patientId || '',
    amount: bill?.amount?.toString() || '',
    taxAmount: bill?.taxAmount?.toString() || '0',
    dueDate: bill?.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
    status: bill?.status || 'pending' as 'pending' | 'paid' | 'failed' | 'refunded',
    paymentMethod: bill?.paymentMethod || '',
    paymentReference: bill?.paymentReference || '',
  });

  const createBillMutation = useMutation({
    mutationFn: async (data: CreateBillRequest) => {
      return await backend.clinic.createBill(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create bill error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to create bill',
        variant: 'destructive',
      });
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: async (data: UpdateBillRequest) => {
      return await backend.clinic.updateBill(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Update bill error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update bill',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      taxAmount: parseFloat(formData.taxAmount),
      dueDate: new Date(formData.dueDate),
    };

    if (isEditing && bill) {
      updateBillMutation.mutate({
        id: bill.id,
        ...submitData,
        paidAt: formData.status === 'paid' && bill.status !== 'paid' ? new Date() : undefined,
      });
    } else {
      createBillMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate patient when appointment is selected
    if (field === 'appointmentId') {
      const appointment = appointments.find(a => a.id === value);
      if (appointment) {
        setFormData(prev => ({
          ...prev,
          appointmentId: value,
          patientId: appointment.patientId,
        }));
      }
    }
  };

  const isLoading = createBillMutation.isPending || updateBillMutation.isPending;

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const totalAmount = (parseFloat(formData.amount) || 0) + (parseFloat(formData.taxAmount) || 0);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">
              {isEditing ? 'Edit Bill' : t('billing.add')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentId">Appointment</Label>
                  <Select value={formData.appointmentId} onValueChange={(value) => handleChange('appointmentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map((appointment) => (
                        <SelectItem key={appointment.id} value={appointment.id}>
                          {new Date(appointment.appointmentDate).toLocaleDateString()} - {getPatientName(appointment.patientId)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient</Label>
                  <Select value={formData.patientId} onValueChange={(value) => handleChange('patientId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t('billing.amount')}</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxAmount">{t('billing.taxAmount')}</Label>
                  <Input
                    id="taxAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.taxAmount}
                    onChange={(e) => handleChange('taxAmount', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t('billing.dueDate')}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    required
                  />
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('common.status')}</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">{t('billing.paymentMethod')}</Label>
                    <Input
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      placeholder="e.g., Credit Card, Cash, UPI"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentReference">{t('billing.paymentReference')}</Label>
                    <Input
                      id="paymentReference"
                      value={formData.paymentReference}
                      onChange={(e) => handleChange('paymentReference', e.target.value)}
                      placeholder="Transaction ID or reference"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t('billing.totalAmount')}:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? t('common.loading') : t('common.save')}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
