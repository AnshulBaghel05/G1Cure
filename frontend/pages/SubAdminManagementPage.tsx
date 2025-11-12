import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Shield, Users, UserCog } from 'lucide-react';
import { SubAdminForm } from '../components/SubAdminForm';
import { listSubAdmins } from '@/lib/api';

export function SubAdminManagementPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: subAdminsData, isLoading } = useQuery({
    queryKey: ['sub-admins'],
    queryFn: () => listSubAdmins(),
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
  };

  const getDepartmentColor = (department?: string) => {
    const colors: Record<string, string> = {
      'Pharmacy': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Dentistry': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'Cardiology': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'Emergency': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      'Laboratory': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    };
    return colors[department || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getPermissionCount = (permissions: any[]) => {
    if (!permissions || permissions.length === 0) return 0;
    const perm = permissions[0];
    return Object.values(perm).filter(value => value === true).length - 4; // Exclude non-permission fields
  };

  return (
    <div className="space-y-8">
      <div
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sub-Admin Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage department-specific administrators and their permissions.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sub-Admin
        </Button>
      </div>

      <div
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse dark:bg-gray-800">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subAdminsData?.subAdmins
            .filter(subAdmin => 
              searchTerm === '' || 
              `${subAdmin.firstName} ${subAdmin.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
              subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (subAdmin.department && subAdmin.department.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((subAdmin, index) => (
            <div
              key={subAdmin.id}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">
                          {subAdmin.firstName} {subAdmin.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{subAdmin.email}</p>
                      </div>
                    </div>
                    <Badge variant={subAdmin.isActive ? 'default' : 'secondary'}>
                      {subAdmin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {subAdmin.department && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Department:</span>
                        <Badge className={getDepartmentColor(subAdmin.department)}>
                          {subAdmin.department}
                        </Badge>
                      </div>
                    )}
                    {subAdmin.subAdminType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium dark:text-white text-right">{subAdmin.subAdminType}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Permissions:</span>
                      <span className="font-medium dark:text-white">
                        {getPermissionCount(subAdmin.permissions || [])} granted
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {subAdminsData?.subAdmins.length === 0 && !isLoading && (
        <div
          className="text-center py-12"
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sub-admins found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create department-specific administrators to distribute workload efficiently.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Sub-Admin
          </Button>
        </div>
      )}

      {showForm && (
        <SubAdminForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
