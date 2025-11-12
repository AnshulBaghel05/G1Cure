import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Trash2, User, Activity, Brain, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientForm } from '../components/PatientForm';
import { PatientTimeline } from '../components/PatientTimeline';
import { getPatients, deletePatient, type Patient } from '@/lib/api';

export function PatientsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'analytics'>('list');

  const { data: patientsData, isLoading, error } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      const response = await getPatients({
        search: searchTerm || undefined,
        limit: 100,
      });
      return response;
    },
  });

  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      await deletePatient(patientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: t('common.success'),
        description: 'Patient deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete patient error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to delete patient',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatientMutation.mutate(patientId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['patients'] });
    handleFormClose();
    toast({
      title: t('common.success'),
      description: editingPatient ? 'Patient updated successfully' : 'Patient created successfully',
    });
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('timeline');
  };

  // Mock medical events for timeline
  const mockMedicalEvents = [
    {
      id: '1',
      eventType: 'appointment' as const,
      title: 'Annual Checkup',
      description: 'Routine annual health examination',
      eventDate: new Date(2024, 0, 15),
      doctorName: 'Dr. Sarah Johnson',
      severity: 'low' as const,
      isActive: true,
      createdAt: new Date(2024, 0, 15)
    },
    {
      id: '2',
      eventType: 'diagnosis' as const,
      title: 'Seasonal Allergies',
      description: 'Diagnosed with seasonal allergic rhinitis',
      eventDate: new Date(2024, 1, 20),
      doctorName: 'Dr. Michael Chen',
      severity: 'low' as const,
      isActive: true,
      createdAt: new Date(2024, 1, 20)
    },
    {
      id: '3',
      eventType: 'medication' as const,
      title: 'Prescribed Antihistamines',
      description: 'Cetirizine 10mg daily for allergy management',
      eventDate: new Date(2024, 1, 20),
      doctorName: 'Dr. Michael Chen',
      severity: 'low' as const,
      isActive: true,
      createdAt: new Date(2024, 1, 20)
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">{t('patients.title')}</h1>
          <p className="text-gray-600 mt-1">
            Advanced patient management with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Patient List
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setViewMode('timeline')}
            className="flex items-center gap-2"
          >
                                    <Clock className="w-4 h-4" />
                        Timeline View
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setViewMode('analytics')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('patients.add')}
          </Button>
        </div>
      </div>

      {viewMode === 'list' && (
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
      )}

      {viewMode === 'list' && (
        <>
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
              {patientsData?.patients.map((patient, index) => (
                <div
                  key={patient.id}
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-md cursor-pointer" onClick={() => handlePatientSelect(patient)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {patient.firstName} {patient.lastName}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{patient.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {patient.gender}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('common.phone')}:</span>
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DOB:</span>
                          <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency:</span>
                          <span className="text-right">{patient.emergencyContact}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(patient);
                          }}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(patient.id);
                          }}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {patientsData?.patients.length === 0 && !isLoading && (
            <div
              className="text-center py-12"
            >
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('patients.add')}
              </Button>
            </div>
          )}
        </>
      )}

      {viewMode === 'timeline' && selectedPatient && (
        <div
        >
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('list')}
              className="mb-4"
            >
              ← Back to Patient List
            </Button>
            <h2 className="text-xl font-semibold">
              Medical Timeline: {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
          </div>
          <PatientTimeline 
            patientId={selectedPatient.id}
            events={mockMedicalEvents}
            onEventClick={(event) => {
              toast({
                title: "Medical Event",
                description: `Viewing details for: ${event.title}`,
              });
            }}
          />
        </div>
      )}

      {viewMode === 'analytics' && (
        <div
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Total Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {patientsData?.patients.length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Active Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.floor((patientsData?.patients.length || 0) * 0.85)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  24
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  +12%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Gender Distribution</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Male:</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Female:</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span className="font-semibold">3%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">Age Groups</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>18-30:</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>31-50:</span>
                      <span className="font-semibold">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>51+:</span>
                      <span className="font-semibold">35%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">Health Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Healthy:</span>
                      <span className="font-semibold">70%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chronic:</span>
                      <span className="font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-semibold">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
