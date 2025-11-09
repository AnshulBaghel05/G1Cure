import React from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Shield, Bell, CalendarDays } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ProfileSettingsPage() {
  const { user } = useAuth();

  const renderProfileForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" defaultValue={user?.first_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" defaultValue={user?.last_name} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={user?.email} disabled />
      </div>
      <Button>Save Changes</Button>
    </div>
  );

  const renderSecurityForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" type="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" type="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input id="confirmPassword" type="password" />
      </div>
      <Button>Update Password</Button>
    </div>
  );

  const renderAvailabilityForm = () => (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">Set your weekly availability for appointments.</p>
      {/* Placeholder for availability component */}
      <div className="p-8 border rounded-lg text-center text-gray-500 dark:border-gray-700">
        Weekly Availability Calendar Component Here
      </div>
      <Button>Save Availability</Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile & Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account details and preferences.
        </p>
      </div>

      <div
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile"><UserCog className="w-4 h-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
            {user?.role === 'doctor' && (
              <TabsTrigger value="availability"><CalendarDays className="w-4 h-4 mr-2" />Availability</TabsTrigger>
            )}
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderProfileForm()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Password & Security</CardTitle>
                <CardDescription>Change your password and manage security settings.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderSecurityForm()}
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === 'doctor' && (
            <TabsContent value="availability">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">My Availability</CardTitle>
                  <CardDescription>Set your working hours for patient appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAvailabilityForm()}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="notifications">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Notification settings will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
