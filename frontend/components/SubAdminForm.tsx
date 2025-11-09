import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { StandardModal } from './StandardModal';
import backend from '~backend/client';
import type { CreateSubAdminRequest } from '~backend/admin/sub_admin';

interface SubAdminFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubAdminForm({ onClose, onSuccess }: SubAdminFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateSubAdminRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    subAdminType: '',
    permissions: {
      canViewPatients: false,
      canEditPatients: false,
      canViewDoctors: false,
      canEditDoctors: false,
      canViewAppointments: false,
      canEditAppointments: false,
      canViewBilling: false,
      canEditBilling: false,
      canViewAnalytics: false,
      canManageUsers: false,
    },
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => backend.admin.listDepartments(),
  });

  const createSubAdminMutation = useMutation({
    mutationFn: async (data: CreateSubAdminRequest) => {
      return await backend.admin.createSubAdmin(data);
    },
    onSuccess: () => {
      toast({
        title: 'Sub-Admin Created',
        description: 'The new sub-admin has been created successfully.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create sub-admin.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) {
      toast({
        title: 'Error',
        description: 'Password is required.',
        variant: 'destructive',
      });
      return;
    }
    createSubAdminMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }));
  };

  const subAdminTypes = [
    'Pharmacy Manager',
    'Dental Coordinator',
    'Cardiology Coordinator',
    'Orthopedic Coordinator',
    'Pediatric Coordinator',
    'Emergency Coordinator',
    'Lab Manager',
    'Radiology Manager',
    'Surgery Coordinator',
    'General Coordinator',
  ];

  const permissionLabels = {
    canViewPatients: 'View Patients',
    canEditPatients: 'Edit Patients',
    canViewDoctors: 'View Doctors',
    canEditDoctors: 'Edit Doctors',
    canViewAppointments: 'View Appointments',
    canEditAppointments: 'Edit Appointments',
    canViewBilling: 'View Billing',
    canEditBilling: 'Edit Billing',
    canViewAnalytics: 'View Analytics',
    canManageUsers: 'Manage Users',
  };

  return (
    <StandardModal isOpen={true} onClose={onClose} title="Add New Sub-Admin" maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsData?.departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subAdminType">Sub-Admin Type</Label>
            <Select value={formData.subAdminType} onValueChange={(value) => handleChange('subAdminType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {subAdminTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Permissions</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            {Object.entries(permissionLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData.permissions[key as keyof typeof formData.permissions]}
                  onCheckedChange={(checked) => handlePermissionChange(key, checked as boolean)}
                />
                <Label htmlFor={key} className="text-sm font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={createSubAdminMutation.isPending} className="flex-1">
            {createSubAdminMutation.isPending ? 'Creating...' : 'Create Sub-Admin'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={createSubAdminMutation.isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </StandardModal>
  );
}
