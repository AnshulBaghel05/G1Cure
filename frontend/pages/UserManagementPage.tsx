import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, UserCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserForm } from '../components/UserForm';
import { SubAdminManagementPage } from './SubAdminManagementPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // This is a placeholder. In a real app, you'd fetch users.
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // This endpoint doesn't exist yet, so we'll mock it.
      // In a real scenario, you'd create a `listUsers` endpoint.
      return [
        { id: '1', first_name: 'Admin', last_name: 'User', email: 'admin@g1cure.com', role: 'admin' },
        { id: '2', first_name: 'Doctor', last_name: 'Who', email: 'doctor@g1cure.com', role: 'doctor' },
        { id: '3', first_name: 'Patient', last_name: 'Zero', email: 'patient@g1cure.com', role: 'patient' },
      ];
    },
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <div className="space-y-8">
      <div
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all users, roles, and permissions across the system.
          </p>
        </div>
      </div>

      <div
      >
        <Tabs defaultValue="regular-users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular-users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Regular Users
            </TabsTrigger>
            <TabsTrigger value="sub-admins" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              Sub-Admins
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular-users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or role..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  A data table with all users (patients, doctors, admins) will be displayed here, with options to edit roles, activate/deactivate, and delete users.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sub-admins">
            <SubAdminManagementPage />
          </TabsContent>
        </Tabs>
      </div>

      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
