import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";
import { getAuthData } from "~encore/auth";

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comment?: string;
  serviceQuality?: number;
  communication?: number;
  waitTime?: number;
  cleanliness?: number;
  wouldRecommend: boolean;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Nested data
  patient?: {
    firstName: string;
    lastName: string;
  };
  doctor?: {
    firstName: string;
    lastName: string;
    specialization: string;
  };
  appointment?: {
    appointmentDate: Date;
    type: string;
  };
}

export interface CreateReviewRequest {
  appointmentId: string;
  rating: number;
  comment?: string;
  serviceQuality?: number;
  communication?: number;
  waitTime?: number;
  cleanliness?: number;
  wouldRecommend: boolean;
  isAnonymous?: boolean;
}

export interface UpdateReviewRequest {
  id: string;
  rating?: number;
  comment?: string;
  serviceQuality?: number;
  communication?: number;
  waitTime?: number;
  cleanliness?: number;
  wouldRecommend?: boolean;
  isAnonymous?: boolean;
  isApproved?: boolean;
}

export interface ListReviewsRequest {
  limit?: number;
  offset?: number;
  doctorId?: string;
  patientId?: string;
  appointmentId?: string;
  minRating?: number;
  isApproved?: boolean;
}

export interface ListReviewsResponse {
  reviews: Review[];
  total: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  averageServiceQuality: number;
  averageCommunication: number;
  averageWaitTime: number;
  averageCleanliness: number;
  recommendationPercentage: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

export interface GetReviewStatsRequest {
  doctorId?: string;
  startDate?: Date;
  endDate?: Date;
}

// Maps a Supabase row to the Review interface
function mapRowToReview(row: any): Review {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    rating: row.rating,
    comment: row.comment,
    serviceQuality: row.service_quality,
    communication: row.communication,
    waitTime: row.wait_time,
    cleanliness: row.cleanliness,
    wouldRecommend: row.would_recommend,
    isAnonymous: row.is_anonymous,
    isApproved: row.is_approved,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    patient: row.patients ? {
      firstName: row.patients.first_name,
      lastName: row.patients.last_name,
    } : undefined,
    doctor: row.doctors ? {
      firstName: row.doctors.first_name,
      lastName: row.doctors.last_name,
      specialization: row.doctors.specialization,
    } : undefined,
    appointment: row.appointments ? {
      appointmentDate: new Date(row.appointments.appointment_date),
      type: row.appointments.type,
    } : undefined,
  };
}

// Creates a new review
export const createReview = api<CreateReviewRequest, Review>(
  { expose: true, method: "POST", path: "/reviews", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== 'patient') {
      throw APIError.permissionDenied("Only patients can create reviews");
    }

    // Verify the appointment belongs to the patient and is completed
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from("appointments")
      .select("patient_id, doctor_id, status")
      .eq("id", req.appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw APIError.notFound("Appointment not found");
    }

    if (appointment.patient_id !== auth.profileId) {
      throw APIError.permissionDenied("You can only review your own appointments");
    }

    if (appointment.status !== 'completed') {
      throw APIError.failedPrecondition("You can only review completed appointments");
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("appointment_id", req.appointmentId)
      .single();

    if (existingReview) {
      throw APIError.alreadyExists("Review already exists for this appointment");
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        appointment_id: req.appointmentId,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        rating: req.rating,
        comment: req.comment,
        service_quality: req.serviceQuality,
        communication: req.communication,
        wait_time: req.waitTime,
        cleanliness: req.cleanliness,
        would_recommend: req.wouldRecommend,
        is_anonymous: req.isAnonymous || false,
      })
      .select(`
        *,
        patients (first_name, last_name),
        doctors (first_name, last_name, specialization),
        appointments (appointment_date, type)
      `)
      .single();

    if (error) {
      throw APIError.internal("Failed to create review", { cause: error });
    }

    return mapRowToReview(data);
  }
);

// Retrieves a review by ID
export const getReview = api<{ id: string }, Review>(
  { expose: true, method: "GET", path: "/reviews/:id", auth: true },
  async ({ id }) => {
    const auth = getAuthData()!;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select(`
        *,
        patients (first_name, last_name),
        doctors (first_name, last_name, specialization),
        appointments (appointment_date, type)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Review not found", { cause: error });
    }

    // Check permissions
    if (auth.role === 'patient' && data.patient_id !== auth.profileId) {
      throw APIError.permissionDenied("You can only view your own reviews");
    }

    if (auth.role === 'doctor' && data.doctor_id !== auth.profileId) {
      throw APIError.permissionDenied("You can only view reviews for your appointments");
    }

    return mapRowToReview(data);
  }
);

// Lists reviews with optional filtering
export const listReviews = api<ListReviewsRequest, ListReviewsResponse>(
  { expose: true, method: "GET", path: "/reviews", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin
      .from("reviews")
      .select(`
        *,
        patients (first_name, last_name),
        doctors (first_name, last_name, specialization),
        appointments (appointment_date, type)
      `, { count: "exact" });

    // Apply role-based filtering
    if (auth.role === 'patient') {
      query = query.eq("patient_id", auth.profileId);
    } else if (auth.role === 'doctor') {
      query = query.eq("doctor_id", auth.profileId);
    }

    // Apply request filters
    if (req.doctorId) query = query.eq("doctor_id", req.doctorId);
    if (req.patientId && ['admin', 'sub-admin'].includes(auth.role)) {
      query = query.eq("patient_id", req.patientId);
    }
    if (req.appointmentId) query = query.eq("appointment_id", req.appointmentId);
    if (req.minRating) query = query.gte("rating", req.minRating);
    if (req.isApproved !== undefined) query = query.eq("is_approved", req.isApproved);

    query = query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list reviews", { cause: error });
    }

    return {
      reviews: data.map(mapRowToReview),
      total: count || 0,
    };
  }
);

// Updates an existing review
export const updateReview = api<UpdateReviewRequest, Review>(
  { expose: true, method: "PUT", path: "/reviews/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const { id, ...updates } = req;

    // Get the existing review to check permissions
    const { data: existingReview, error: fetchError } = await supabaseAdmin
      .from("reviews")
      .select("patient_id, doctor_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingReview) {
      throw APIError.notFound("Review not found");
    }

    // Check permissions
    if (auth.role === 'patient' && existingReview.patient_id !== auth.profileId) {
      throw APIError.permissionDenied("You can only update your own reviews");
    }

    if (auth.role === 'doctor') {
      throw APIError.permissionDenied("Doctors cannot update reviews");
    }

    if (!['admin', 'sub-admin', 'patient'].includes(auth.role)) {
      throw APIError.permissionDenied("Insufficient permissions");
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.comment !== undefined) updateData.comment = updates.comment;
    if (updates.serviceQuality !== undefined) updateData.service_quality = updates.serviceQuality;
    if (updates.communication !== undefined) updateData.communication = updates.communication;
    if (updates.waitTime !== undefined) updateData.wait_time = updates.waitTime;
    if (updates.cleanliness !== undefined) updateData.cleanliness = updates.cleanliness;
    if (updates.wouldRecommend !== undefined) updateData.would_recommend = updates.wouldRecommend;
    if (updates.isAnonymous !== undefined) updateData.is_anonymous = updates.isAnonymous;
    
    // Only admins can approve/disapprove reviews
    if (updates.isApproved !== undefined && ['admin', 'sub-admin'].includes(auth.role)) {
      updateData.is_approved = updates.isApproved;
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        patients (first_name, last_name),
        doctors (first_name, last_name, specialization),
        appointments (appointment_date, type)
      `)
      .single();

    if (error) {
      throw APIError.internal("Failed to update review", { cause: error });
    }

    return mapRowToReview(data);
  }
);

// Deletes a review
export const deleteReview = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/reviews/:id", auth: true },
  async ({ id }) => {
    const auth = getAuthData()!;

    // Get the existing review to check permissions
    const { data: existingReview, error: fetchError } = await supabaseAdmin
      .from("reviews")
      .select("patient_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingReview) {
      throw APIError.notFound("Review not found");
    }

    // Check permissions
    if (auth.role === 'patient' && existingReview.patient_id !== auth.profileId) {
      throw APIError.permissionDenied("You can only delete your own reviews");
    }

    if (!['admin', 'sub-admin', 'patient'].includes(auth.role)) {
      throw APIError.permissionDenied("Insufficient permissions");
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      throw APIError.internal("Failed to delete review", { cause: error });
    }
  }
);

// Gets review statistics
export const getReviewStats = api<GetReviewStatsRequest, ReviewStats>(
  { expose: true, method: "GET", path: "/reviews/stats", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    // Build the query for statistics
    let query = supabaseAdmin
      .from("reviews")
      .select("rating, service_quality, communication, wait_time, cleanliness, would_recommend")
      .eq("is_approved", true);

    // Apply role-based filtering
    if (auth.role === 'doctor') {
      query = query.eq("doctor_id", auth.profileId);
    } else if (req.doctorId) {
      query = query.eq("doctor_id", req.doctorId);
    }

    if (req.startDate) {
      query = query.gte("created_at", req.startDate.toISOString());
    }

    if (req.endDate) {
      query = query.lte("created_at", req.endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw APIError.internal("Failed to fetch review statistics", { cause: error });
    }

    if (!data || data.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        averageServiceQuality: 0,
        averageCommunication: 0,
        averageWaitTime: 0,
        averageCleanliness: 0,
        recommendationPercentage: 0,
        ratingDistribution: [],
      };
    }

    // Calculate statistics
    const totalReviews = data.length;
    const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const averageServiceQuality = data.filter(r => r.service_quality).reduce((sum, review) => sum + (review.service_quality || 0), 0) / data.filter(r => r.service_quality).length || 0;
    const averageCommunication = data.filter(r => r.communication).reduce((sum, review) => sum + (review.communication || 0), 0) / data.filter(r => r.communication).length || 0;
    const averageWaitTime = data.filter(r => r.wait_time).reduce((sum, review) => sum + (review.wait_time || 0), 0) / data.filter(r => r.wait_time).length || 0;
    const averageCleanliness = data.filter(r => r.cleanliness).reduce((sum, review) => sum + (review.cleanliness || 0), 0) / data.filter(r => r.cleanliness).length || 0;
    const recommendationPercentage = (data.filter(review => review.would_recommend).length / totalReviews) * 100;

    // Calculate rating distribution
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: data.filter(review => review.rating === rating).length,
    }));

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100,
      averageServiceQuality: Math.round(averageServiceQuality * 100) / 100,
      averageCommunication: Math.round(averageCommunication * 100) / 100,
      averageWaitTime: Math.round(averageWaitTime * 100) / 100,
      averageCleanliness: Math.round(averageCleanliness * 100) / 100,
      recommendationPercentage: Math.round(recommendationPercentage * 100) / 100,
      ratingDistribution: ratingCounts,
    };
  }
);

// Checks if a patient can review an appointment
export const canReviewAppointment = api<{ appointmentId: string }, { canReview: boolean; reason?: string }>(
  { expose: true, method: "GET", path: "/reviews/can-review/:appointmentId", auth: true },
  async ({ appointmentId }) => {
    const auth = getAuthData()!;
    if (auth.role !== 'patient') {
      return { canReview: false, reason: "Only patients can create reviews" };
    }

    // Check if appointment exists and belongs to patient
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from("appointments")
      .select("patient_id, status")
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return { canReview: false, reason: "Appointment not found" };
    }

    if (appointment.patient_id !== auth.profileId) {
      return { canReview: false, reason: "You can only review your own appointments" };
    }

    if (appointment.status !== 'completed') {
      return { canReview: false, reason: "You can only review completed appointments" };
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("appointment_id", appointmentId)
      .single();

    if (existingReview) {
      return { canReview: false, reason: "Review already exists for this appointment" };
    }

    return { canReview: true };
  }
);
