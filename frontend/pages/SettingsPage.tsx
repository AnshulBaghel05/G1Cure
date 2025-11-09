import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, CreditCard, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  const [clinicInfo, setClinicInfo] = useState({
    name: 'G1Cure Demo Clinic',
    address: '123 Health St, Wellness City, India',
    phone: '+91 98765 43210',
    email: 'contact@g1curedemo.com',
  });

  const handleInfoChange = (field: keyof typeof clinicInfo, value: string) => {
    setClinicInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage clinic-wide settings and configurations.
        </p>
      </div>

      <div
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general"><Building className="w-4 h-4 mr-2" />General</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="w-4 h-4 mr-2" />Billing</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your clinic's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input id="clinicName" value={clinicInfo.name} onChange={(e) => handleInfoChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">Address</Label>
                  <Textarea id="clinicAddress" value={clinicInfo.address} onChange={(e) => handleInfoChange('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicPhone">Phone Number</Label>
                    <Input id="clinicPhone" value={clinicInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinicEmail">Contact Email</Label>
                    <Input id="clinicEmail" type="email" value={clinicInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>Configure payment gateways and invoice settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Connect your Stripe account and manage payment settings.</p>
                <Button>Connect with Stripe</Button>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" placeholder="e.g., 18" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Customize automated email and SMS templates.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Template editor for appointment reminders, billing alerts, etc. will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security policies and view audit logs.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Options for two-factor authentication, session timeouts, and an audit log viewer will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
