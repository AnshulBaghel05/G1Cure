import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '~backend/clinic/appointment';
import type { Patient } from '~backend/clinic/patient';
import type { Doctor } from '~backend/clinic/doctor';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  patients: Patient[];
  doctors: Doctor[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentForm({ appointment, patients, doctors, onClose, onSuccess }: AppointmentFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!appointment;

  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    appointmentDate: appointment?.appointmentDate 
      ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
      : '',
    duration: appointment?.duration?.toString() || '30',
    type: appointment?.type || 'consultation' as 'consultation' | 'follow-up' | 'emergency' | 'telemedicine',
    status: appointment?.status || 'scheduled' as 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show',
    notes: appointment?.notes || '',
    symptoms: appointment?.symptoms || '',
    diagnosis: appointment?.diagnosis || '',
    prescription: appointment?.prescription || '',
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      return await backend.clinic.createAppointment(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create appointment error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to create appointment',
        variant: 'destructive',
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: UpdateAppointmentRequest) => {
      return await backend.clinic.updateAppointment(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Update appointment error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update appointment',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      appointmentDate: new Date(formData.appointmentDate),
      duration: parseInt(formData.duration),
    };

    if (isEditing && appointment) {
      updateAppointmentMutation.mutate({
        id: appointment.id,
        ...submitData,
      });
    } else {
      createAppointmentMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createAppointmentMutation.isPending || updateAppointmentMutation.isPending;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">
              {isEditing ? 'Edit Appointment' : t('appointments.add')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">{t('appointments.patient')}</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="doctorId">{t('appointments.doctor')}</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => handleChange('doctorId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">{t('appointments.appointmentDate')}</Label>
                  <Input
                    id="appointmentDate"
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => handleChange('appointmentDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">{t('appointments.duration')}</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t('appointments.type')}</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="telemedicine">Telemedicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('common.status')}</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">{t('appointments.symptoms')}</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleChange('symptoms', e.target.value)}
                  placeholder="Enter patient symptoms..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t('appointments.notes')}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter appointment notes..."
                />
              </div>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">{t('appointments.diagnosis')}</Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => handleChange('diagnosis', e.target.value)}
                      placeholder="Enter diagnosis..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prescription">{t('appointments.prescription')}</Label>
                    <Textarea
                      id="prescription"
                      value={formData.prescription}
                      onChange={(e) => handleChange('prescription', e.target.value)}
                      placeholder="Enter prescription..."
                    />
                  </div>
                </>
              )}

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
