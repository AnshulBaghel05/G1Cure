import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: string;
  bio?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: string;
  bio?: string;
  profileImage?: string;
}

export interface UpdateDoctorRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  qualification?: string;
  consultationFee?: number;
  availability?: string;
  bio?: string;
  profileImage?: string;
}

export interface ListDoctorsRequest {
  limit?: number;
  offset?: number;
  specialization?: string;
  search?: string;
}

export interface ListDoctorsResponse {
  doctors: Doctor[];
  total: number;
}

// Maps a Supabase row to the Doctor interface.
function mapRowToDoctor(row: any): Doctor {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    specialization: row.specialization,
    licenseNumber: row.license_number,
    experience: row.experience,
    qualification: row.qualification,
    consultationFee: row.consultation_fee,
    availability: row.availability,
    bio: row.bio,
    profileImage: row.profile_image,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new doctor record.
export const createDoctor = api<CreateDoctorRequest, Doctor>(
  { expose: true, method: "POST", path: "/doctors" },
  async (req) => {
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .insert({
        user_id: req.userId,
        first_name: req.firstName,
        last_name: req.lastName,
        email: req.email,
        phone: req.phone,
        specialization: req.specialization,
        license_number: req.licenseNumber,
        experience: req.experience,
        qualification: req.qualification,
        consultation_fee: req.consultationFee,
        availability: req.availability,
        bio: req.bio,
        profile_image: req.profileImage,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create doctor", { cause: error });
    }
    return mapRowToDoctor(data);
  }
);

// Retrieves a doctor by ID.
export const getDoctor = api<{ id: string }, Doctor>(
  { expose: true, method: "GET", path: "/doctors/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Doctor not found", { cause: error });
    }
    return mapRowToDoctor(data);
  }
);

// Lists all doctors with optional filtering.
export const listDoctors = api<ListDoctorsRequest, ListDoctorsResponse>(
  { expose: true, method: "GET", path: "/doctors" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin.from("doctors").select("*", { count: "exact" });

    if (req.specialization) {
      query = query.ilike("specialization", `%${req.specialization}%`);
    }
    if (req.search) {
      query = query.or(`first_name.ilike.%${req.search}%,last_name.ilike.%${req.search}%,email.ilike.%${req.search}%`);
    }

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list doctors", { cause: error });
    }

    return {
      doctors: data.map(mapRowToDoctor),
      total: count || 0,
    };
  }
);

// Updates an existing doctor record.
export const updateDoctor = api<UpdateDoctorRequest, Doctor>(
  { expose: true, method: "PUT", path: "/doctors/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.specialization) updateData.specialization = updates.specialization;
    if (updates.licenseNumber) updateData.license_number = updates.licenseNumber;
    if (updates.experience) updateData.experience = updates.experience;
    if (updates.qualification) updateData.qualification = updates.qualification;
    if (updates.consultationFee) updateData.consultation_fee = updates.consultationFee;
    if (updates.availability) updateData.availability = updates.availability;
    if (updates.bio) updateData.bio = updates.bio;
    if (updates.profileImage) updateData.profile_image = updates.profileImage;

    const { data, error } = await supabaseAdmin
      .from("doctors")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update doctor", { cause: error });
    }
    return mapRowToDoctor(data);
  }
);

// Deletes a doctor record.
export const deleteDoctor = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/doctors/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("doctors").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete doctor", { cause: error });
    }
  }
);
