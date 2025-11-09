import React from 'react';
import { StandardModal } from './StandardModal';
import { FileText, HeartPulse, FlaskConical, Stethoscope, Shield, Activity } from 'lucide-react';

interface HealthRecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: string;
}

export function HealthRecordDetailModal({ isOpen, onClose, recordType }: HealthRecordDetailModalProps) {
  const recordDetails = {
    'Past Appointments': {
      icon: Stethoscope,
      color: 'text-blue-600',
      content: <p>List of past appointments with dates, doctors, and notes will be displayed here.</p>,
    },
    'Prescriptions': {
      icon: FileText,
      color: 'text-green-600',
      content: <p>A detailed list of all past and current prescriptions will be shown here.</p>,
    },
    'Lab Reports': {
      icon: FlaskConical,
      color: 'text-purple-600',
      content: <p>Links to view or download lab reports will be available here.</p>,
    },
    'Vitals History': {
      icon: HeartPulse,
      color: 'text-red-600',
      content: <p>A chart and table showing the history of vital signs (e.g., blood pressure, heart rate) will be here.</p>,
    },
    'Allergies': {
      icon: Shield,
      color: 'text-yellow-600',
      content: <p>A list of all recorded allergies and reactions will be displayed here.</p>,
    },
    'Medical History': {
      icon: Activity,
      color: 'text-orange-600',
      content: <p>A comprehensive overview of the patient's medical history, including past conditions and surgeries.</p>,
    },
  };

  const details = recordDetails[recordType as keyof typeof recordDetails] || recordDetails['Past Appointments'];
  const Icon = details.icon;

  return (
    <StandardModal isOpen={isOpen} onClose={onClose} title={recordType}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${details.color}`} />
          <h3 className="text-xl font-semibold">{recordType} Details</h3>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {details.content}
        </div>
      </div>
    </StandardModal>
  );
}
