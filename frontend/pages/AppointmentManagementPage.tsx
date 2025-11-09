import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppointmentsPage } from './AppointmentsPage';

export function AppointmentManagementPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Appointment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Oversee all scheduled appointments across the clinic.
          </p>
        </div>
      </div>

      <div
      >
        <AppointmentsPage />
      </div>
    </div>
  );
}
