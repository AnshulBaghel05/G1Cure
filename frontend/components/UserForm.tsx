import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { StandardModal } from './StandardModal';
import backend from '~backend/client';
import type { SignupRequest } from '~backend/supabase/auth';

interface UserFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ onClose, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: SignupRequest) => {
      return await backend.supabase.adminCreateUser(data);
    },
    onSuccess: () => {
      toast({
        title: 'User Created',
        description: 'The new user has been created successfully.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user.',
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
    createUserMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <StandardModal isOpen={true} onClose={onClose} title="Add New User">
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={createUserMutation.isPending} className="flex-1">
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={createUserMutation.isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </StandardModal>
  );
}
