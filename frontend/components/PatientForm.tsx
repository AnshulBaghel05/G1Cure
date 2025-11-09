import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { StandardModal } from './StandardModal';
import backend from '~backend/client';
import type { Patient, CreatePatientRequest, UpdatePatientRequest } from '~backend/clinic/patient';

interface PatientFormProps {
  patient?: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PatientForm({ patient, onClose, onSuccess }: PatientFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
    gender: patient?.gender || 'male' as 'male' | 'female' | 'other',
    address: patient?.address || '',
    emergencyContact: patient?.emergencyContact || '',
    emergencyPhone: patient?.emergencyPhone || '',
    medicalHistory: patient?.medicalHistory || '',
    allergies: patient?.allergies || '',
    currentMedications: patient?.currentMedications || '',
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: CreatePatientRequest) => {
      // This endpoint requires a userId, which we don't have when a doctor creates a patient.
      // This needs to be handled by a different backend endpoint, e.g., `adminCreateUser`.
      // For now, this will fail if not called correctly.
      // A better approach is to create the user via the auth endpoint first.
      console.warn("Creating a patient directly is not fully implemented. A user record should be created first.");
      return await backend.clinic.createPatient(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create patient error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to create patient. A corresponding user must be created first.',
        variant: 'destructive',
      });
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: async (data: UpdatePatientRequest) => {
      return await backend.clinic.updatePatient(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Update patient error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update patient',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
    };

    if (isEditing && patient) {
      updatePatientMutation.mutate({
        id: patient.id,
        ...submitData,
      });
    } else {
      // This part is problematic as it requires a userId.
      // The correct flow is to use the UserForm to create a user with the patient role.
      toast({
        title: "Action Not Supported",
        description: "Please use the 'Add User' feature in the Admin dashboard to create new patients.",
        variant: "destructive",
      });
      // createPatientMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createPatientMutation.isPending || updatePatientMutation.isPending;

  return (
    <StandardModal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Patient' : t('patients.add')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('patients.firstName')}</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('patients.lastName')}</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('common.phone')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t('patients.dateOfBirth')}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">{t('patients.gender')}</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('patients.address')}</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">{t('patients.emergencyContact')}</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">{t('patients.emergencyPhone')}</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => handleChange('emergencyPhone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalHistory">{t('patients.medicalHistory')}</Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => handleChange('medicalHistory', e.target.value)}
            placeholder="Enter medical history..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">{t('patients.allergies')}</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            placeholder="Enter known allergies..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentMedications">{t('patients.currentMedications')}</Label>
          <Textarea
            id="currentMedications"
            value={formData.currentMedications}
            onChange={(e) => handleChange('currentMedications', e.target.value)}
            placeholder="Enter current medications..."
          />
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
    </StandardModal>
  );
}
