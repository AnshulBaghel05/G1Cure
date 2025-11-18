import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";
import { getAuthData } from "~encore/auth";

export interface SubAdminPermissions {
  id: string;
  userId: string;
  departmentId: string;
  departmentName?: string;
  canViewPatients: boolean;
  canEditPatients: boolean;
  canViewDoctors: boolean;
  canEditDoctors: boolean;
  canViewAppointments: boolean;
  canEditAppointments: boolean;
  canViewBilling: boolean;
  canEditBilling: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  subAdminType: string;
  permissions: {
    canViewPatients: boolean;
    canEditPatients: boolean;
    canViewDoctors: boolean;
    canEditDoctors: boolean;
    canViewAppointments: boolean;
    canEditAppointments: boolean;
    canViewBilling: boolean;
    canEditBilling: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
  };
}

export interface UpdateSubAdminPermissionsRequest {
  userId: string;
  departmentId: string;
  permissions: {
    canViewPatients: boolean;
    canEditPatients: boolean;
    canViewDoctors: boolean;
    canEditDoctors: boolean;
    canViewAppointments: boolean;
    canEditAppointments: boolean;
    canViewBilling: boolean;
    canEditBilling: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
  };
}

export interface ListSubAdminsResponse {
  subAdmins: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    subAdminType?: string;
    isActive: boolean;
    permissions?: SubAdminPermissions[];
  }>;
}

export interface GetUserPermissionsResponse {
  permissions: SubAdminPermissions[];
}

// Maps a Supabase row to the SubAdminPermissions interface
function mapRowToPermissions(row: any): SubAdminPermissions {
  return {
    id: row.id,
    userId: row.user_id,
    departmentId: row.department_id,
    departmentName: row.departments?.name,
    canViewPatients: row.can_view_patients,
    canEditPatients: row.can_edit_patients,
    canViewDoctors: row.can_view_doctors,
    canEditDoctors: row.can_edit_doctors,
    canViewAppointments: row.can_view_appointments,
    canEditAppointments: row.can_edit_appointments,
    canViewBilling: row.can_view_billing,
    canEditBilling: row.can_edit_billing,
    canViewAnalytics: row.can_view_analytics,
    canManageUsers: row.can_manage_users,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new sub-admin user with permissions
export const createSubAdmin = api<CreateSubAdminRequest, { user: any }>(
  { expose: true, method: "POST", path: "/admin/sub-admins", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can create sub-admins");
    }

    let authUserId: string | undefined;
    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: req.email,
        password: req.password,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        throw new Error(`Auth user creation failed: ${authError?.message}`);
      }
      authUserId = authData.user.id;

      // 2. Create user profile in 'users' table
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUserId,
          email: req.email,
          first_name: req.firstName,
          last_name: req.lastName,
          role: 'sub-admin',
          department: req.department,
          sub_admin_type: req.subAdminType,
          is_active: true,
        })
        .select()
        .single();

      if (userError) {
        throw new Error(`Profile creation failed: ${userError.message}`);
      }

      // 3. Get department ID
      const { data: departmentData, error: deptError } = await supabaseAdmin
        .from('departments')
        .select('id')
        .eq('name', req.department)
        .single();

      if (deptError || !departmentData) {
        throw new Error(`Department not found: ${req.department}`);
      }

      // 4. Create permissions
      const { error: permError } = await supabaseAdmin
        .from('sub_admin_permissions')
        .insert({
          user_id: authUserId,
          department_id: departmentData.id,
          can_view_patients: req.permissions.canViewPatients,
          can_edit_patients: req.permissions.canEditPatients,
          can_view_doctors: req.permissions.canViewDoctors,
          can_edit_doctors: req.permissions.canEditDoctors,
          can_view_appointments: req.permissions.canViewAppointments,
          can_edit_appointments: req.permissions.canEditAppointments,
          can_view_billing: req.permissions.canViewBilling,
          can_edit_billing: req.permissions.canEditBilling,
          can_view_analytics: req.permissions.canViewAnalytics,
          can_manage_users: req.permissions.canManageUsers,
        });

      if (permError) {
        throw new Error(`Permissions creation failed: ${permError.message}`);
      }

      return { user: userData };
    } catch (error: any) {
      // Cleanup on failure
      if (authUserId) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUserId);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
      }
      console.error('Create sub-admin error:', error);
      throw APIError.internal(`Sub-admin creation failed: ${error.message}`);
    }
  }
);

// Lists all sub-admin users
export const listSubAdmins = api<void, ListSubAdminsResponse>(
  { expose: true, method: "GET", path: "/admin/sub-admins", auth: true },
  async () => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can view sub-admins");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        first_name,
        last_name,
        email,
        department,
        sub_admin_type,
        is_active,
        sub_admin_permissions (
          id,
          department_id,
          can_view_patients,
          can_edit_patients,
          can_view_doctors,
          can_edit_doctors,
          can_view_appointments,
          can_edit_appointments,
          can_view_billing,
          can_edit_billing,
          can_view_analytics,
          can_manage_users,
          created_at,
          updated_at,
          departments (name)
        )
      `)
      .eq("role", "sub-admin")
      .order("created_at", { ascending: false });

    if (error) {
      throw APIError.internal("Failed to fetch sub-admins", { cause: error });
    }

    const subAdmins = data.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      department: user.department,
      subAdminType: user.sub_admin_type,
      isActive: user.is_active,
      permissions: user.sub_admin_permissions?.map((perm: any) => ({
        ...mapRowToPermissions(perm),
        departmentName: perm.departments?.name,
      })) || [],
    }));

    return { subAdmins };
  }
);

// Gets permissions for the current user
export const getUserPermissions = api<void, GetUserPermissionsResponse>(
  { expose: true, method: "GET", path: "/admin/my-permissions", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    if (auth.role === 'admin') {
      // Main admin has all permissions
      return { permissions: [] }; // Empty array indicates full admin access
    }

    if (auth.role !== 'sub-admin') {
      throw APIError.permissionDenied("Only admins and sub-admins can view permissions");
    }

    const { data, error } = await supabaseAdmin
      .from("sub_admin_permissions")
      .select(`
        *,
        departments (name)
      `)
      .eq("user_id", auth.userID);

    if (error) {
      throw APIError.internal("Failed to fetch permissions", { cause: error });
    }

    return {
      permissions: data.map(perm => ({
        ...mapRowToPermissions(perm),
        departmentName: perm.departments?.name,
      })),
    };
  }
);

// Updates sub-admin permissions
export const updateSubAdminPermissions = api<UpdateSubAdminPermissionsRequest, SubAdminPermissions>(
  { expose: true, method: "PUT", path: "/admin/sub-admin-permissions", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can update permissions");
    }

    const { data, error } = await supabaseAdmin
      .from("sub_admin_permissions")
      .update({
        can_view_patients: req.permissions.canViewPatients,
        can_edit_patients: req.permissions.canEditPatients,
        can_view_doctors: req.permissions.canViewDoctors,
        can_edit_doctors: req.permissions.canEditDoctors,
        can_view_appointments: req.permissions.canViewAppointments,
        can_edit_appointments: req.permissions.canEditAppointments,
        can_view_billing: req.permissions.canViewBilling,
        can_edit_billing: req.permissions.canEditBilling,
        can_view_analytics: req.permissions.canViewAnalytics,
        can_manage_users: req.permissions.canManageUsers,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", req.userId)
      .eq("department_id", req.departmentId)
      .select(`
        *,
        departments (name)
      `)
      .single();

    if (error) {
      throw APIError.internal("Failed to update permissions", { cause: error });
    }

    return {
      ...mapRowToPermissions(data),
      departmentName: data.departments?.name,
    };
  }
);
