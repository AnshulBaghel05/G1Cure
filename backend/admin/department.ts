import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";
import { getAuthData } from "~encore/auth";

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  location?: string;
  contactEmail?: string;
  budget?: number;
  maxStaffCapacity?: number;
  currentStaffCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager?: string;
  location?: string;
  contactEmail?: string;
  budget?: number;
  maxStaffCapacity?: number;
}

export interface UpdateDepartmentRequest {
  id: string;
  name?: string;
  description?: string;
  manager?: string;
  location?: string;
  contactEmail?: string;
  budget?: number;
  maxStaffCapacity?: number;
  isActive?: boolean;
}

export interface DeleteDepartmentRequest {
  id: string;
}

export interface GetDepartmentRequest {
  id: string;
}

export interface ListDepartmentsResponse {
  departments: Department[];
  total: number;
}

export interface DepartmentStatsResponse {
  totalDepartments: number;
  activeDepartments: number;
  totalStaff: number;
  totalBudget: number;
  departmentUtilization: Array<{
    departmentId: string;
    departmentName: string;
    staffCount: number;
    maxCapacity: number;
    utilizationPercentage: number;
  }>;
}

// Maps a Supabase row to the Department interface
function mapRowToDepartment(row: any): Department {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    manager: row.manager,
    location: row.location,
    contactEmail: row.contact_email,
    budget: row.budget,
    maxStaffCapacity: row.max_staff_capacity,
    currentStaffCount: row.current_staff_count || 0,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Lists all departments with optional filters
export const listDepartments = api<{ activeOnly?: boolean }, ListDepartmentsResponse>(
  { expose: true, method: "GET", path: "/admin/departments", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (!['admin', 'sub-admin'].includes(auth.role)) {
      throw APIError.permissionDenied("Only admins and sub-admins can view departments");
    }

    let query = supabaseAdmin
      .from("departments")
      .select("*, current_staff_count:users(count)", { count: 'exact' })
      .order("name");

    // Apply filter
    if (req?.activeOnly !== false) {
      query = query.eq("is_active", true);
    }

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to fetch departments", { cause: error });
    }

    return {
      departments: (data || []).map(mapRowToDepartment),
      total: count || 0,
    };
  }
);

// Gets a single department by ID
export const getDepartment = api<GetDepartmentRequest, Department>(
  { expose: true, method: "GET", path: "/admin/departments/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (!['admin', 'sub-admin'].includes(auth.role)) {
      throw APIError.permissionDenied("Only admins and sub-admins can view departments");
    }

    const { data, error } = await supabaseAdmin
      .from("departments")
      .select("*")
      .eq("id", req.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound(`Department with ID ${req.id} not found`);
      }
      throw APIError.internal("Failed to fetch department", { cause: error });
    }

    // Get current staff count
    const { count: staffCount } = await supabaseAdmin
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("department", data.name);

    return mapRowToDepartment({ ...data, current_staff_count: staffCount || 0 });
  }
);

// Creates a new department
export const createDepartment = api<CreateDepartmentRequest, Department>(
  { expose: true, method: "POST", path: "/admin/departments", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can create departments");
    }

    // Validate required fields
    if (!req.name || req.name.trim().length === 0) {
      throw APIError.invalidArgument("Department name is required");
    }

    // Check if department with same name already exists
    const { data: existing } = await supabaseAdmin
      .from("departments")
      .select("id")
      .eq("name", req.name)
      .single();

    if (existing) {
      throw APIError.alreadyExists(`Department with name "${req.name}" already exists`);
    }

    // Validate email format if provided
    if (req.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.contactEmail)) {
        throw APIError.invalidArgument("Invalid email format");
      }
    }

    // Validate budget if provided
    if (req.budget !== undefined && req.budget < 0) {
      throw APIError.invalidArgument("Budget cannot be negative");
    }

    // Validate max staff capacity if provided
    if (req.maxStaffCapacity !== undefined && req.maxStaffCapacity < 1) {
      throw APIError.invalidArgument("Max staff capacity must be at least 1");
    }

    const { data, error } = await supabaseAdmin
      .from("departments")
      .insert({
        name: req.name.trim(),
        description: req.description?.trim(),
        manager: req.manager?.trim(),
        location: req.location?.trim(),
        contact_email: req.contactEmail?.trim(),
        budget: req.budget,
        max_staff_capacity: req.maxStaffCapacity,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create department", { cause: error });
    }

    return mapRowToDepartment({ ...data, current_staff_count: 0 });
  }
);

// Updates an existing department
export const updateDepartment = api<UpdateDepartmentRequest, Department>(
  { expose: true, method: "PUT", path: "/admin/departments/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can update departments");
    }

    // Check if department exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("departments")
      .select("*")
      .eq("id", req.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw APIError.notFound(`Department with ID ${req.id} not found`);
      }
      throw APIError.internal("Failed to fetch department", { cause: fetchError });
    }

    // If name is being updated, check for duplicates
    if (req.name && req.name !== existing.name) {
      const { data: duplicate } = await supabaseAdmin
        .from("departments")
        .select("id")
        .eq("name", req.name)
        .neq("id", req.id)
        .single();

      if (duplicate) {
        throw APIError.alreadyExists(`Department with name "${req.name}" already exists`);
      }
    }

    // Validate email format if provided
    if (req.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.contactEmail)) {
        throw APIError.invalidArgument("Invalid email format");
      }
    }

    // Validate budget if provided
    if (req.budget !== undefined && req.budget < 0) {
      throw APIError.invalidArgument("Budget cannot be negative");
    }

    // Validate max staff capacity if provided
    if (req.maxStaffCapacity !== undefined && req.maxStaffCapacity < 1) {
      throw APIError.invalidArgument("Max staff capacity must be at least 1");
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (req.name !== undefined) updateData.name = req.name.trim();
    if (req.description !== undefined) updateData.description = req.description.trim();
    if (req.manager !== undefined) updateData.manager = req.manager.trim();
    if (req.location !== undefined) updateData.location = req.location.trim();
    if (req.contactEmail !== undefined) updateData.contact_email = req.contactEmail.trim();
    if (req.budget !== undefined) updateData.budget = req.budget;
    if (req.maxStaffCapacity !== undefined) updateData.max_staff_capacity = req.maxStaffCapacity;
    if (req.isActive !== undefined) updateData.is_active = req.isActive;

    const { data, error } = await supabaseAdmin
      .from("departments")
      .update(updateData)
      .eq("id", req.id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update department", { cause: error });
    }

    // Get current staff count
    const { count: staffCount } = await supabaseAdmin
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("department", data.name);

    return mapRowToDepartment({ ...data, current_staff_count: staffCount || 0 });
  }
);

// Deletes a department (soft delete by setting isActive to false)
export const deleteDepartment = api<DeleteDepartmentRequest, { success: boolean; message: string }>(
  { expose: true, method: "DELETE", path: "/admin/departments/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only main admins can delete departments");
    }

    // Check if department exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("departments")
      .select("name")
      .eq("id", req.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw APIError.notFound(`Department with ID ${req.id} not found`);
      }
      throw APIError.internal("Failed to fetch department", { cause: fetchError });
    }

    // Check if department has active staff
    const { count: staffCount } = await supabaseAdmin
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("department", existing.name)
      .eq("is_active", true);

    if (staffCount && staffCount > 0) {
      throw APIError.failedPrecondition(
        `Cannot delete department with ${staffCount} active staff member(s). Please reassign staff first.`
      );
    }

    // Soft delete by setting is_active to false
    const { error } = await supabaseAdmin
      .from("departments")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.id);

    if (error) {
      throw APIError.internal("Failed to delete department", { cause: error });
    }

    return {
      success: true,
      message: `Department "${existing.name}" has been deactivated successfully`,
    };
  }
);

// Gets department statistics and analytics
export const getDepartmentStats = api<void, DepartmentStatsResponse>(
  { expose: true, method: "GET", path: "/admin/departments/stats", auth: true },
  async () => {
    const auth = getAuthData()!;
    if (!['admin', 'sub-admin'].includes(auth.role)) {
      throw APIError.permissionDenied("Only admins and sub-admins can view department statistics");
    }

    // Get all departments
    const { data: departments, error: deptError } = await supabaseAdmin
      .from("departments")
      .select("*");

    if (deptError) {
      throw APIError.internal("Failed to fetch departments", { cause: deptError });
    }

    const activeDepartments = departments?.filter(d => d.is_active) || [];
    const totalBudget = activeDepartments.reduce((sum, d) => sum + (d.budget || 0), 0);

    // Get staff counts per department
    const departmentUtilization = await Promise.all(
      activeDepartments.map(async (dept) => {
        const { count: staffCount } = await supabaseAdmin
          .from("users")
          .select("*", { count: 'exact', head: true })
          .eq("department", dept.name)
          .eq("is_active", true);

        const maxCapacity = dept.max_staff_capacity || 100;
        const utilizationPercentage = maxCapacity > 0
          ? Math.round((staffCount || 0) / maxCapacity * 100)
          : 0;

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          staffCount: staffCount || 0,
          maxCapacity,
          utilizationPercentage,
        };
      })
    );

    const totalStaff = departmentUtilization.reduce((sum, d) => sum + d.staffCount, 0);

    return {
      totalDepartments: departments?.length || 0,
      activeDepartments: activeDepartments.length,
      totalStaff,
      totalBudget,
      departmentUtilization,
    };
  }
);
