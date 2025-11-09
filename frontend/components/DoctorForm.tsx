import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import backend from '~backend/client';
import type { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '~backend/clinic/doctor';

interface DoctorFormProps {
  doctor?: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DoctorForm({ doctor, onClose, onSuccess }: DoctorFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!doctor;

  const [formData, setFormData] = useState({
    firstName: doctor?.firstName || '',
    lastName: doctor?.lastName || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    specialization: doctor?.specialization || '',
    licenseNumber: doctor?.licenseNumber || '',
    experience: doctor?.experience?.toString() || '',
    qualification: doctor?.qualification || '',
    consultationFee: doctor?.consultationFee?.toString() || '',
    availability: doctor?.availability || '',
    bio: doctor?.bio || '',
    profileImage: doctor?.profileImage || '',
  });

  const createDoctorMutation = useMutation({
    mutationFn: async (data: CreateDoctorRequest) => {
      return await backend.clinic.createDoctor(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create doctor error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to create doctor',
        variant: 'destructive',
      });
    },
  });

  const updateDoctorMutation = useMutation({
    mutationFn: async (data: UpdateDoctorRequest) => {
      return await backend.clinic.updateDoctor(data);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Update doctor error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update doctor',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      experience: parseInt(formData.experience),
      consultationFee: parseFloat(formData.consultationFee),
    };

    if (isEditing && doctor) {
      updateDoctorMutation.mutate({
        id: doctor.id,
        ...submitData,
      });
    } else {
      createDoctorMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createDoctorMutation.isPending || updateDoctorMutation.isPending;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">
              {isEditing ? 'Edit Doctor' : t('doctors.add')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
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
                  <Label htmlFor="specialization">{t('doctors.specialization')}</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">{t('doctors.licenseNumber')}</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">{t('doctors.experience')}</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">{t('doctors.consultationFee')}</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee}
                    onChange={(e) => handleChange('consultationFee', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">{t('doctors.qualification')}</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">{t('doctors.availability')}</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleChange('availability', e.target.value)}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('doctors.bio')}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Enter doctor's bio..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => handleChange('profileImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
