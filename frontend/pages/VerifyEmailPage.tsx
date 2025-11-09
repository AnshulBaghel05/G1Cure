import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token found.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  const statusContent = {
    verifying: {
      icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
      title: 'Verifying Your Email',
      message: 'Please wait while we activate your account...',
    },
    success: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Email Verified!',
      message: 'Your account has been activated. Redirecting you to the dashboard...',
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Verification Failed',
      message: errorMessage,
    },
  };

  const currentStatus = statusContent[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              G1Cure Account Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center space-y-4 py-8">
              <motion.div
                key={status}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                {currentStatus.icon}
              </motion.div>
              <h3 className="text-xl font-semibold">{currentStatus.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{currentStatus.message}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
