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

export { updateDoctorRating };
