import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Star, X, ThumbsUp, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { StandardModal } from './StandardModal';
import { createReview, type CreateReviewData } from '@/lib/api';

interface ReviewFormProps {
  appointmentId: string;
  doctorName: string;
  appointmentDate: Date;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({ appointmentId, doctorName, appointmentDate, onClose, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateReviewData>({
    appointment_id: appointmentId,
    rating: 0,
    comment: '',
    service_quality: 0,
    communication: 0,
    wait_time: 0,
    cleanliness: 0,
    would_recommend: true,
    is_anonymous: false,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: CreateReviewData) => {
      return await createReview(data);
    },
    onSuccess: () => {
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback! Your review has been submitted successfully.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide an overall rating.',
        variant: 'destructive',
      });
      return;
    }
    createReviewMutation.mutate(formData);
  };

  const handleRatingChange = (field: keyof CreateReviewData, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  const handleChange = (field: keyof CreateReviewData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label, 
    icon: Icon = Star 
  }: { 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className={`w-6 h-6 ${star <= value ? 'fill-current' : ''}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <StandardModal isOpen={true} onClose={onClose} title="Rate Your Experience" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How was your appointment with {doctorName}?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {appointmentDate.toLocaleDateString()} at {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Overall Rating */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Label className="text-lg font-semibold">Overall Experience</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange('rating', star)}
                    className={`p-2 rounded-full transition-colors ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className={`w-8 h-8 ${star <= formData.rating ? 'fill-current' : ''}`} />
                  </motion.button>
                ))}
              </div>
              {formData.rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {formData.rating === 1 && "We're sorry to hear that. We'll work to improve."}
                  {formData.rating === 2 && "Thank you for the feedback. We'll do better."}
                  {formData.rating === 3 && "Thanks for the feedback. We appreciate it."}
                  {formData.rating === 4 && "Great! We're glad you had a good experience."}
                  {formData.rating === 5 && "Excellent! Thank you for the wonderful feedback."}
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StarRating
            value={formData.service_quality || 0}
            onChange={(rating) => handleRatingChange('service_quality', rating)}
            label="Service Quality"
            icon={ThumbsUp}
          />
          <StarRating
            value={formData.communication || 0}
            onChange={(rating) => handleRatingChange('communication', rating)}
            label="Communication"
            icon={MessageSquare}
          />
          <StarRating
            value={formData.wait_time || 0}
            onChange={(rating) => handleRatingChange('wait_time', rating)}
            label="Wait Time"
            icon={Clock}
          />
          <StarRating
            value={formData.cleanliness || 0}
            onChange={(rating) => handleRatingChange('cleanliness', rating)}
            label="Cleanliness"
            icon={Sparkles}
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Share your experience (optional)</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="would_recommend"
              checked={formData.would_recommend}
              onCheckedChange={(checked) => handleChange('would_recommend', checked as boolean)}
            />
            <Label htmlFor="would_recommend" className="text-sm">
              I would recommend this doctor to others
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => handleChange('is_anonymous', checked as boolean)}
            />
            <Label htmlFor="is_anonymous" className="text-sm">
              Submit this review anonymously
            </Label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={createReviewMutation.isPending} className="flex-1">
            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={createReviewMutation.isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </StandardModal>
  );
}
