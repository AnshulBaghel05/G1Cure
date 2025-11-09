import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';
import type { CreateSessionRequest } from '~backend/telemedicine/session';
import type { Appointment } from '~backend/clinic/appointment';
import type { Patient } from '~backend/clinic/patient';
import type { Doctor } from '~backend/clinic/doctor';

interface TelemedicineFormProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onClose: () => void;
  onSuccess: () => void;
}

export function TelemedicineForm({ appointments, patients, doctors, onClose, onSuccess }: TelemedicineFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    doctorId: '',
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: CreateSessionRequest) => {
      return await backend.telemedicine.createSession(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create session error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to create telemedicine session',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointmentId || !formData.patientId || !formData.doctorId) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createSessionMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate patient and doctor when appointment is selected
    if (field === 'appointmentId') {
      const appointment = appointments.find(a => a.id === value);
      if (appointment) {
        setFormData(prev => ({
          ...prev,
          appointmentId: value,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        }));
      }
    }
  };

  const isLoading = createSessionMutation.isPending;

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">
              Create Telemedicine Session
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appointmentId">Appointment</Label>
                <Select value={formData.appointmentId} onValueChange={(value) => handleChange('appointmentId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments
                      .filter(apt => apt.type === 'telemedicine' && apt.status !== 'completed' && apt.status !== 'cancelled')
                      .map((appointment) => (
                        <SelectItem key={appointment.id} value={appointment.id}>
                          {new Date(appointment.appointmentDate).toLocaleDateString()} - {getPatientName(appointment.patientId)} with {getDoctorName(appointment.doctorId)}
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

              <div className="space-y-2">
                <Label htmlFor="doctorId">Doctor</Label>
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

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? t('common.loading') : 'Create Session'}
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
