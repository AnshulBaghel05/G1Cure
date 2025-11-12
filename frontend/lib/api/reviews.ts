import { supabase, handleSupabaseError } from './supabase';

export interface Review {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  rating: number;
  service_quality?: number;
  communication?: number;
  wait_time?: number;
  cleanliness?: number;
  comment?: string;
  would_recommend: boolean;
  is_anonymous: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  appointment_id: string;
  rating: number;
  service_quality?: number;
  communication?: number;
  wait_time?: number;
  cleanliness?: number;
  comment?: string;
  would_recommend: boolean;
  is_anonymous?: boolean;
}

// Create review
export async function createReview(reviewData: CreateReviewData) {
  try {
    // Get appointment to get patient_id and doctor_id
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('patient_id, doctor_id')
      .eq('id', reviewData.appointment_id)
      .single();

    if (aptError) throw handleSupabaseError(aptError);

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          ...reviewData,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          is_approved: true, // Auto-approve for now
        },
      ])
      .select()
      .single();

    if (error) throw handleSupabaseError(error);

    // Update doctor's average rating
    await updateDoctorRating(appointment.doctor_id);

    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get reviews for a doctor
export async function getDoctorReviews(doctorId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, patients(first_name, last_name)')
      .eq('doctor_id', doctorId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update doctor's average rating
async function updateDoctorRating(doctorId: string) {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('doctor_id', doctorId)
      .eq('is_approved', true);

    if (error) throw handleSupabaseError(error);

    if (reviews && reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      await supabase
        .from('doctors')
        .update({
          rating: avgRating,
          total_reviews: reviews.length,
        })
        .eq('id', doctorId);
    }
  } catch (error) {
    console.error('Error updating doctor rating:', error);
  }
}

// Get all reviews with filters
export async function getReviews(options?: {
  doctorId?: string;
  patientId?: string;
  minRating?: number;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('reviews')
      .select('*, patients(first_name, last_name, id), doctors(first_name, last_name, specialization)')
      .eq('is_approved', true);

    if (options?.doctorId) {
      query = query.eq('doctor_id', options.doctorId);
    }
    if (options?.patientId) {
      query = query.eq('patient_id', options.patientId);
    }
    if (options?.minRating) {
      query = query.gte('rating', options.minRating);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);

    // Transform data to match expected format
    const reviews = (data || []).map(review => ({
      ...review,
      patient: review.patients,
      doctor: review.doctors,
      isAnonymous: review.is_anonymous,
    }));

    return { reviews, total: reviews.length };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get review statistics
export async function getReviewStats(options?: { doctorId?: string }) {
  try {
    let query = supabase
      .from('reviews')
      .select('rating, service_quality, would_recommend')
      .eq('is_approved', true);

    if (options?.doctorId) {
      query = query.eq('doctor_id', options.doctorId);
    }

    const { data: reviews, error } = await query;

    if (error) throw handleSupabaseError(error);

    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        recommendationPercentage: 0,
        averageServiceQuality: 0,
        ratingDistribution: [
          { rating: 5, count: 0 },
          { rating: 4, count: 0 },
          { rating: 3, count: 0 },
          { rating: 2, count: 0 },
          { rating: 1, count: 0 },
        ],
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const recommendCount = reviews.filter(r => r.would_recommend).length;
    const recommendationPercentage = Math.round((recommendCount / totalReviews) * 100);

    const serviceQualitySum = reviews.reduce((sum, r) => sum + (r.service_quality || r.rating), 0);
    const averageServiceQuality = serviceQualitySum / totalReviews;

    // Calculate rating distribution
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
    }));

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      recommendationPercentage,
      averageServiceQuality: Number(averageServiceQuality.toFixed(1)),
      ratingDistribution: distribution,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

export { updateDoctorRating };
