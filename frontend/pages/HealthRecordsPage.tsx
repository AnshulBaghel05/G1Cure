import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HeartPulse, FlaskConical, Stethoscope, Shield, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { HealthRecordDetailModal } from '../components/HealthRecordDetailModal';

export function HealthRecordsPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState('');

  const recordTypes = [
    { title: 'Past Appointments', icon: Stethoscope, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
    { title: 'Prescriptions', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/50' },
    { title: 'Lab Reports', icon: FlaskConical, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/50' },
    { title: 'Vitals History', icon: HeartPulse, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/50' },
    { title: 'Allergies', icon: Shield, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50' },
    { title: 'Medical History', icon: Activity, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/50' },
  ];

  const handleViewDetails = (recordType: string) => {
    setSelectedRecordType(recordType);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Health Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A complete and secure overview of your medical history, {user?.first_name}.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordTypes.map((record, index) => {
            const Icon = record.icon;
            return (
              <motion.div
                key={record.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${record.bgColor}`}>
                        <Icon className={`w-6 h-6 ${record.color}`} />
                      </div>
                      <CardTitle className="dark:text-white">{record.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">View your {record.title.toLowerCase()}.</p>
                    <Button variant="outline" className="w-full" onClick={() => handleViewDetails(record.title)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Recent Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">A timeline of recent health activities will be displayed here.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <HealthRecordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recordType={selectedRecordType}
      />
    </>
  );
}
