import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Weight,
  Stethoscope,
  Pill,
  Syringe,
  Microscope,
  Scan,
  Brain,
  Bone,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedIcon, 
  AnimatedBadge, 
  AnimatedInput,
  AnimatedProgress,
  AnimatedModal
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBackendClient } from '../../lib/backend';

interface MedicalRecord {
  id: string;
  type: 'lab-result' | 'prescription' | 'diagnosis' | 'vaccination' | 'imaging' | 'surgery' | 'consultation';
  title: string;
  date: string;
  doctor: string;
  specialty: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  description: string;
  attachments?: string[];
  notes?: string;
  followUp?: string;
}

interface VitalSign {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  prescribedBy: string;
  notes?: string;
}

export function MedicalRecordsPage() {
  const { user } = useAuth();
  const backend = useBackendClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);

              // Load appointments (which contain medical records)
              const appointmentsResponse = await backend.clinic.listAppointments({
                patientId: user.profile_id || user.id,
                limit: 100
              });

              // Load prescriptions
              const prescriptionsResponse = await backend.clinic.listPrescriptions({
                patientId: user.profile_id || user.id,
                limit: 100
              });

        // Transform appointments to medical records
        const records: MedicalRecord[] = appointmentsResponse.appointments?.map((appointment: any) => ({
          id: appointment.id,
          type: 'consultation' as const,
          title: `Consultation - ${appointment.type}`,
          date: appointment.appointmentDate,
          doctor: { firstName: 'Dr.', lastName: 'Smith', specialty: 'General' }, // We'll need to fetch doctor details
          status: appointment.status === 'completed' ? 'normal' as const : 'pending' as const,
          description: appointment.notes || appointment.diagnosis || 'No description available',
          attachments: [],
          tags: [appointment.type]
        }));

        // Transform prescriptions to medical records
        const prescriptionRecords: MedicalRecord[] = prescriptionsResponse.prescriptions?.map((prescription: any) => ({
          id: prescription.id,
          type: 'prescription' as const,
          title: `Prescription - ${prescription.medicationName}`,
          date: prescription.createdAt,
          doctor: { firstName: 'Dr.', lastName: 'Smith', specialty: 'General' },
          status: 'normal' as const,
          description: `${prescription.medicationName} ${prescription.dosage} - ${prescription.instructions}`,
          attachments: [],
          tags: ['prescription', prescription.medicationName]
        }));

        setMedicalRecords([...records, ...prescriptionRecords]);

        // Mock vital signs and medications for now (these would need separate endpoints)
        setVitalSigns([
          {
            name: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            status: 'normal' as const,
            trend: 'stable' as const,
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            status: 'normal' as const,
            trend: 'stable' as const,
            lastUpdated: new Date().toISOString(),
          }
        ]);

        setMedications(prescriptionsResponse.prescriptions?.map((prescription: any) => ({
          id: prescription.id,
          name: prescription.medicationName,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          startDate: prescription.createdAt,
          endDate: prescription.duration ? new Date(Date.now() + parseInt(prescription.duration) * 24 * 60 * 60 * 1000).toISOString() : null,
          status: 'active' as const,
          prescribedBy: prescription.doctorId,
          notes: prescription.instructions
        })));

      } catch (err) {
        console.error('Error loading medical records:', err);
        setError('Failed to load medical records. Please try again.');
        
        // Fallback to mock data if API fails
        const fallbackRecords = [
          {
            id: '1',
            type: 'lab-result' as const,
            title: 'Blood Test Results',
            date: '2024-01-15',
            doctor: { firstName: 'Sarah', lastName: 'Johnson', specialty: 'Cardiology' },
            status: 'normal' as const,
            description: 'Complete blood count and lipid panel results within normal ranges.',
            attachments: ['blood-test-2024-01-15.pdf'],
            tags: ['lab', 'blood test', 'routine']
          },
          {
            id: '2',
            type: 'prescription' as const,
            title: 'Medication Prescription',
            date: '2024-01-10',
            doctor: { firstName: 'Michael', lastName: 'Chen', specialty: 'Internal Medicine' },
            status: 'normal' as const,
            description: 'Prescription for blood pressure medication with dosage instructions.',
            attachments: ['prescription-2024-01-10.pdf'],
            tags: ['prescription', 'medication']
          }
        ];

        const fallbackVitalSigns = [
          {
            name: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            status: 'normal' as const,
            trend: 'stable' as const,
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            status: 'normal' as const,
            trend: 'stable' as const,
            lastUpdated: new Date().toISOString(),
          }
        ];

        const fallbackMedications = [
          {
            id: '1',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: '2024-01-01',
            endDate: null,
            status: 'active' as const,
            prescribedBy: 'Dr. Sarah Johnson',
            notes: 'Take with food, monitor blood pressure daily'
          }
        ];

        setMedicalRecords(fallbackRecords);
        setVitalSigns(fallbackVitalSigns);
        setMedications(fallbackMedications);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, backend]);

  // Mock upload mutation (replace with real API call)
  const uploadDocumentMutation = {
    mutateAsync: async (file: File) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Uploading file:', file.name);
      return { success: true };
    },
    isPending: false
  };





  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      await uploadDocumentMutation.mutateAsync(uploadFile);
      alert('Document uploaded successfully!');
      setIsUploadModalOpen(false);
      setUploadFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleExportRecords = async () => {
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock PDF blob
      const mockPdfContent = `Medical Records Export
Generated: ${new Date().toLocaleDateString()}

Patient: ${user?.email || 'Unknown'}

Records:
${medicalRecords.map(record => `- ${record.title} (${record.date})`).join('\n')}`;
      
      const blob = new Blob([mockPdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medical-records-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export records. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab-result': return Microscope;
      case 'prescription': return Pill;
      case 'diagnosis': return Stethoscope;
      case 'vaccination': return Syringe;
      case 'imaging': return Scan;
      case 'surgery': return Bone;
      case 'consultation': return User;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'from-emerald-500 to-teal-500';
      case 'abnormal': return 'from-orange-500 to-red-500';
      case 'critical': return 'from-red-500 to-pink-500';
      case 'pending': return 'from-blue-500 to-indigo-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-emerald-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      case 'critical': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const doctorName = record.doctor ? 
      `Dr. ${(record.doctor as any).firstName} ${(record.doctor as any).lastName}` : 
      'Unknown Doctor';
    const specialty = (record.doctor as any)?.specialty || 'General';
    
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openRecordModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsRecordModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading medical records...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Records</h2>
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
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-20"
        >
          <FileText className="text-blue-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 text-5xl opacity-10 dark:opacity-20"
        >
          <Stethoscope className="text-purple-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-20 text-4xl opacity-10 dark:opacity-20"
        >
          <Heart className="text-emerald-400" />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Enhanced Header */}
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
                Medical Records
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-slate-600 dark:text-slate-300 mt-3"
              >
                Access and manage your complete health history and medical documents
              </motion.p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                onClick={handleExportRecords}
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-xl font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Records
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl px-6 py-3 rounded-xl font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Document
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Vital Signs Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Vital Signs Overview
                </h2>
                <AnimatedButton
                  size="sm"
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl font-medium"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Update Vitals
                </AnimatedButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {vitalSigns.map((vital, index) => (
                  <motion.div
                    key={vital.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 hover:from-slate-100 to-slate-200 dark:hover:from-slate-700/50 dark:hover:to-slate-600/50 transition-all duration-300 border border-slate-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      {vital.name === 'Blood Pressure' && <Heart className="w-7 h-7 text-white" />}
                      {vital.name === 'Heart Rate' && <Activity className="w-7 h-7 text-white" />}
                      {vital.name === 'Temperature' && <Thermometer className="w-7 h-7 text-white" />}
                      {vital.name === 'Oxygen Saturation' && <Droplets className="w-7 h-7 text-white" />}
                      {vital.name === 'Weight' && <Weight className="w-7 h-7 text-white" />}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {vital.name}
                    </h3>
                    <p className={`text-2xl font-bold ${getVitalStatusColor(vital.status)} mb-2`}>
                      {vital.value}
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                        {vital.unit}
                      </span>
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        vital.status === 'normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        vital.status === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        vital.status === 'low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {vital.status}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">{vital.lastUpdated}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Current Medications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Current Medications
              </h2>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <motion.div
                    key={medication.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 hover:from-slate-100 to-slate-200 dark:hover:from-slate-700/50 dark:hover:to-slate-600/50 transition-all duration-300 border border-slate-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                          {medication.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Prescribed by {medication.prescribedBy} on {new Date(medication.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        medication.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                      }`}>
                        {medication.status}
                      </div>
                      <button className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <AnimatedInput
                      type="text"
                      placeholder="Search records, doctors, or specialties..."
                      value={searchTerm}
                      onChange={(e: any) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="all">All Types</option>
                      <option value="lab-result">Lab Results</option>
                      <option value="prescription">Prescriptions</option>
                      <option value="diagnosis">Diagnoses</option>
                      <option value="vaccination">Vaccinations</option>
                      <option value="imaging">Imaging</option>
                      <option value="surgery">Surgeries</option>
                      <option value="consultation">Consultations</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="all">All Status</option>
                      <option value="normal">Normal</option>
                      <option value="abnormal">Abnormal</option>
                      <option value="critical">Critical</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Medical Records List */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
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
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                Error loading medical records
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No medical records found
              </p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Upload your first document to get started'}
              </p>
            </div>
          ) : (
            filteredRecords.map((record, index) => {
              const doctorName = record.doctor ? 
                `Dr. ${(record.doctor as any).firstName} ${(record.doctor as any).lastName}` : 
                'Unknown Doctor';
              const specialty = (record.doctor as any)?.specialty || 'General';
              
              return (
                <motion.div
                  key={record.id}
                  variants={itemVariants as any}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                    <div className="relative p-6 rounded-2xl">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Left Side - Record Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                              {(() => {
                                const IconComponent = getTypeIcon(record.type);
                                return <IconComponent className="w-7 h-7 text-white" />;
                              })()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                  {record.title}
                                </h3>
                                <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(record.status)} text-white rounded-full text-sm font-medium shadow-lg`}>
                                  {record.status}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <span className="font-medium">{doctorName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <span className="font-medium">{specialty}</span>
                                </div>
                              </div>
                              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50 mb-3">
                                <p className="text-slate-700 dark:text-slate-300 text-sm">
                                  {record.description}
                                </p>
                              </div>
                              {record.notes && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/50 mb-3">
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <span className="font-semibold text-slate-900 dark:text-white">Notes:</span> {record.notes}
                                  </p>
                                </div>
                              )}
                              {record.followUp && (
                                <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-3 border border-emerald-200/50 dark:border-emerald-700/50">
                                  <Clock className="w-4 h-4" />
                                  <span><strong>Follow-up:</strong> {record.followUp}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex flex-col items-end space-y-4">
                          {record.attachments && record.attachments.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-lg">
                                {record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-3">
                            <button
                              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => openRecordModal(record)}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {record.attachments && record.attachments.length > 0 && (
                              <button className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Download className="w-5 h-5" />
                              </button>
                            )}
                            <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Record Detail Modal */}
        <AnimatedModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          title={selectedRecord?.title || 'Medical Record Details'}
          size="lg"
        >
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Record Type
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {(() => {
                      const IconComponent = getTypeIcon(selectedRecord.type);
                      return <IconComponent className="w-5 h-5 text-blue-600" />;
                    })()}
                    <span className="text-slate-900 dark:text-white capitalize">
                      {selectedRecord.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(selectedRecord.status)} text-white rounded-full text-sm font-medium inline-block`}>
                    {selectedRecord.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(selectedRecord.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Doctor
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedRecord.doctor}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  {selectedRecord.description}
                </p>
              </div>

              {selectedRecord.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Notes
                  </label>
                  <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}

              {selectedRecord.followUp && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Follow-up Instructions
                  </label>
                  <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {selectedRecord.followUp}
                  </p>
                </div>
              )}

              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Attachments
                  </label>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <span className="text-slate-700 dark:text-slate-300">{attachment}</span>
                        <button className="px-3 py-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm">
                          <Download className="w-4 h-4 mr-2 inline" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-all duration-300"
                  onClick={() => setIsRecordModalOpen(false)}
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export Record
                </button>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* Upload Document Modal */}
        <AnimatedModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Medical Document"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Document
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
              <AnimatedButton
                onClick={() => setIsUploadModalOpen(false)}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                onClick={handleUploadDocument}
                disabled={!uploadFile || uploadDocumentMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadDocumentMutation.isPending ? 'Uploading...' : 'Upload Document'}
              </AnimatedButton>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </div>
  );
}
