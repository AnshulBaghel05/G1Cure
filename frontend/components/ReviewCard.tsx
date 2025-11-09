import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, Clock, Sparkles, User } from 'lucide-react';
import type { Review } from '~backend/reviews/review';

interface ReviewCardProps {
  review: Review;
  showPatientName?: boolean;
  showDoctorName?: boolean;
}

export function ReviewCard({ review, showPatientName = false, showDoctorName = false }: ReviewCardProps) {
  const getPatientName = () => {
    if (review.isAnonymous) return 'Anonymous Patient';
    if (review.patient) {
      return `${review.patient.firstName} ${review.patient.lastName}`;
    }
    return 'Patient';
  };

  const getDoctorName = () => {
    if (review.doctor) {
      return `Dr. ${review.doctor.firstName} ${review.doctor.lastName}`;
    }
    return 'Doctor';
  };

  const StarDisplay = ({ rating, label, icon: Icon }: { rating?: number; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600 dark:text-gray-400">{label}:</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                {showPatientName && (
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getPatientName()}
                  </p>
                )}
                {showDoctorName && (
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getDoctorName()}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {review.rating}/5
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              "{review.comment}"
            </p>
          )}
          
          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-2">
            <StarDisplay rating={review.serviceQuality} label="Service" icon={ThumbsUp} />
            <StarDisplay rating={review.communication} label="Communication" icon={MessageSquare} />
            <StarDisplay rating={review.waitTime} label="Wait Time" icon={Clock} />
            <StarDisplay rating={review.cleanliness} label="Cleanliness" icon={Sparkles} />
          </div>
          
          {/* Recommendation Badge */}
          {review.wouldRecommend && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              Recommends this doctor
            </Badge>
          )}
          
          {/* Anonymous Badge */}
          {review.isAnonymous && (
            <Badge variant="outline" className="text-xs">
              Anonymous Review
            </Badge>
          )}
          
          {/* Appointment Info */}
          {review.appointment && (
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
              Appointment: {review.appointment.appointmentDate.toLocaleDateString()} • {review.appointment.type}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
