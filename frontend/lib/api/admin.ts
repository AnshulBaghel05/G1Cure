import { supabase, supabaseAdmin, handleSupabaseError } from './supabase';

export interface SubAdmin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  sub_admin_type?: string;
  is_active: boolean;
  permissions?: any[];
  created_at: string;
  updated_at: string;
}

// List all sub-admins
export async function listSubAdmins() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, sub_admin_permissions(*)')
      .eq('role', 'sub-admin')
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);

    // Transform data to match expected format
    const subAdmins = (data || []).map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      department: user.department,
      subAdminType: user.sub_admin_type,
      isActive: user.is_active !== false,
      permissions: user.sub_admin_permissions || [],
      createdAt: user.created_at,
    }));

    return { subAdmins, total: subAdmins.length };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create sub-admin
export async function createSubAdmin(subAdminData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department?: string;
  sub_admin_type?: string;
}) {
  try {
    // Create auth user (requires admin client)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: subAdminData.email,
      password: subAdminData.password,
      email_confirm: true,
      user_metadata: {
        first_name: subAdminData.first_name,
        last_name: subAdminData.last_name,
        role: 'sub-admin',
      },
    });

    if (authError) throw handleSupabaseError(authError);

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: subAdminData.first_name,
        last_name: subAdminData.last_name,
        role: 'sub-admin',
        department: subAdminData.department,
        sub_admin_type: subAdminData.sub_admin_type,
        is_active: true,
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);

    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update sub-admin
export async function updateSubAdmin(id: string, updates: Partial<SubAdmin>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: updates.first_name,
        last_name: updates.last_name,
        department: updates.department,
        sub_admin_type: updates.sub_admin_type,
        is_active: updates.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Delete sub-admin
export async function deleteSubAdmin(id: string) {
  try {
    // Deactivate instead of hard delete
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw handleSupabaseError(error);
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get lab report upload URL (using Supabase Storage)
export async function getLabReportUploadUrl(options: {
  filename: string;
  contentType: string;
}) {
  try {
    const filePath = `lab-reports/${Date.now()}-${options.filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('medical-files')
      .createSignedUploadUrl(filePath);

    if (error) throw handleSupabaseError(error);

    // Get public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    return {
      uploadUrl: data.signedUrl,
      accessUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
