import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Trash2, UserCheck, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DoctorForm } from '../components/DoctorForm';
import backend from '~backend/client';
import type { Doctor } from '~backend/clinic/doctor';

export function DoctorsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { data: doctorsData, isLoading, error } = useQuery({
    queryKey: ['doctors', searchTerm],
    queryFn: async () => {
      const response = await backend.clinic.listDoctors({
        search: searchTerm || undefined,
        limit: 100,
      });
      return response;
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      await backend.clinic.deleteDoctor({ id: doctorId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: t('common.success'),
        description: 'Doctor deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete doctor error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to delete doctor',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctorMutation.mutate(doctorId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    handleFormClose();
    toast({
      title: t('common.success'),
      description: editingDoctor ? 'Doctor updated successfully' : 'Doctor created successfully',
    });
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
          <h1 className="text-3xl font-bold text-gray-900">{t('doctors.title')}</h1>
          <p className="text-gray-600 mt-1">
            Manage doctor profiles and information
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('doctors.add')}
        </Button>
      </div>

      <div
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {doctorsData?.doctors.map((doctor, index) => (
            <div
              key={doctor.id}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doctor.experience}y exp
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.email')}:</span>
                      <span className="text-right truncate">{doctor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.phone')}:</span>
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-medium">₹{doctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="text-right text-xs">{doctor.licenseNumber}</span>
                    </div>
                  </div>
                  
                  {doctor.bio && (
                    <p className="text-xs text-gray-600 line-clamp-2">{doctor.bio}</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(doctor)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {doctorsData?.doctors.length === 0 && !isLoading && (
        <div
          className="text-center py-12"
        >
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('doctors.add')}
          </Button>
        </div>
      )}

      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
