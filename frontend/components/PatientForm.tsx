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
import { createPatient, updatePatient, type CreatePatientData, type UpdatePatientData, type Patient } from '@/lib/api';

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
    first_name: patient?.first_name || '',
    last_name: patient?.last_name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    date_of_birth: patient?.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
    gender: patient?.gender || 'male' as 'male' | 'female' | 'other',
    address: patient?.address || '',
    emergency_contact: patient?.emergency_contact || '',
    emergency_phone: patient?.emergency_phone || '',
    medical_history: patient?.medical_history || '',
    allergies: patient?.allergies || '',
    current_medications: patient?.current_medications || '',
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: CreatePatientData) => {
      // This endpoint requires a user_id, which we don't have when a doctor creates a patient.
      // This needs to be handled by a different backend endpoint, e.g., `adminCreateUser`.
      // For now, this will fail if not called correctly.
      // A better approach is to create the user via the auth endpoint first.
      console.warn("Creating a patient directly is not fully implemented. A user record should be created first.");
      return await createPatient(data);
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
    mutationFn: async ({ id, updates }: { id: string; updates: UpdatePatientData }) => {
      return await updatePatient(id, updates);
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
      date_of_birth: formData.date_of_birth,
    };

    if (isEditing && patient) {
      updatePatientMutation.mutate({
        id: patient.id,
        updates: submitData,
      });
    } else {
      // This part is problematic as it requires a user_id.
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
            <Label htmlFor="first_name">{t('patients.firstName')}</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">{t('patients.lastName')}</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
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
            <Label htmlFor="date_of_birth">{t('patients.dateOfBirth')}</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
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
            <Label htmlFor="emergency_contact">{t('patients.emergencyContact')}</Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_phone">{t('patients.emergencyPhone')}</Label>
            <Input
              id="emergency_phone"
              value={formData.emergency_phone}
              onChange={(e) => handleChange('emergency_phone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medical_history">{t('patients.medicalHistory')}</Label>
          <Textarea
            id="medical_history"
            value={formData.medical_history}
            onChange={(e) => handleChange('medical_history', e.target.value)}
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
          <Label htmlFor="current_medications">{t('patients.currentMedications')}</Label>
          <Textarea
            id="current_medications"
            value={formData.current_medications}
            onChange={(e) => handleChange('current_medications', e.target.value)}
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
