import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Search, TrendingUp, Users, MessageSquare, ThumbsUp } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { useAuth } from '../contexts/AuthContext';
import backend from '~backend/client';
import type { ReviewStats } from '~backend/reviews/review';

export function ReviewsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', searchTerm, ratingFilter],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (ratingFilter !== 'all') {
        params.minRating = parseInt(ratingFilter);
      }
      return await backend.reviews.listReviews(params);
    },
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      const params: any = {};
      if (user?.role === 'doctor') {
        params.doctorId = user.profile_id;
      }
      return await backend.reviews.getReviewStats(params);
    },
  });

  const isDoctor = user?.role === 'doctor';
  const isAdmin = ['admin', 'sub-admin'].includes(user?.role || '');

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'text-blue-600',
    bgColor = 'bg-blue-100'
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    bgColor?: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${bgColor} dark:bg-opacity-20 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color} dark:text-opacity-80`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isDoctor ? 'My Reviews' : 'Patient Reviews'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isDoctor 
            ? 'See what patients are saying about your care'
            : 'Monitor patient feedback and satisfaction across the clinic'
          }
        </p>
      </motion.div>

      {/* Statistics */}
      {reviewStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Total Reviews"
            value={reviewStats.totalReviews}
            icon={MessageSquare}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Average Rating"
            value={`${reviewStats.averageRating}/5`}
            icon={Star}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            title="Recommendation Rate"
            value={`${reviewStats.recommendationPercentage}%`}
            icon={ThumbsUp}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Service Quality"
            value={`${reviewStats.averageServiceQuality}/5`}
            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </motion.div>
      )}

      {/* Rating Distribution */}
      {reviewStats && reviewStats.ratingDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewStats.ratingDistribution.reverse().map((item) => (
                  <div key={item.rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium dark:text-white">{item.rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${reviewStats.totalReviews > 0 ? (item.count / reviewStats.totalReviews) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="1">1+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Reviews List */}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviewsData?.reviews
            .filter(review => 
              searchTerm === '' || 
              (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (review.patient && !review.isAnonymous && 
                `${review.patient.firstName} ${review.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (review.doctor && 
                `${review.doctor.firstName} ${review.doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                showPatientName={isAdmin || isDoctor}
                showDoctorName={isAdmin && !isDoctor}
              />
            ))}
        </motion.div>
      )}

      {reviewsData?.reviews.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isDoctor 
              ? 'Reviews from your patients will appear here after completed appointments.'
              : 'Patient reviews will appear here as they submit feedback.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}
