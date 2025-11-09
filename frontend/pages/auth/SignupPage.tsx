import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Phone, Heart, Shield, Users, Zap, CheckCircle } from 'lucide-react';
import { AnimatedButton, AnimatedCard, AnimatedInput, AnimatedIcon, AnimatedBadge } from '@/components/ui';
import { useAuth } from '../../contexts/AuthContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role
      });
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Heart, title: 'Patient Care', description: 'Comprehensive health management' },
    { icon: Shield, title: 'Data Security', description: 'HIPAA compliant protection' },
    { icon: Users, title: 'Team Access', description: 'Collaborate seamlessly' },
    { icon: Zap, title: 'Real-time Sync', description: 'Instant updates across devices' },
  ];

  const roleBenefits = {
    patient: [
      'Easy appointment booking',
      'Medical records access',
      'Telemedicine consultations',
      'Prescription management'
    ],
    doctor: [
      'Patient management tools',
      'Appointment scheduling',
      'Medical records editing',
      'Analytics dashboard'
    ],
    admin: [
      'User management',
      'System administration',
      'Financial reporting',
      'Performance analytics'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Benefits & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Brand Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <AnimatedIcon size="xl" animation="pulse" color="#10B981">
                  <Heart className="w-16 h-16" />
                </AnimatedIcon>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  G1Cure
                </h1>
              </div>
              <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium">
                Join the Future of Healthcare
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Create your account and experience the most advanced healthcare management platform. 
                Designed for patients, doctors, and administrators.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <AnimatedCard 
                    className="p-6 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                    hoverEffect="glow"
                    entranceAnimation="slideUp"
                  >
                    <div className="text-center space-y-3">
                      <AnimatedIcon 
                        size="lg" 
                        animation="pulse" 
                        color="#10B981"
                        className="mx-auto group-hover:scale-110 transition-transform duration-300"
                      >
                        <benefit.icon className="w-8 h-8" />
                      </AnimatedIcon>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Role Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Benefits for {formData.role === 'patient' ? 'Patients' : formData.role === 'doctor' ? 'Doctors' : 'Administrators'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {roleBenefits[formData.role].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                    className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <AnimatedCard 
              className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 shadow-2xl"
              hoverEffect="lift"
              entranceAnimation="slideRight"
            >
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Create Account
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Join G1Cure and transform healthcare
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    I am a
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['patient', 'doctor', 'admin'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleInputChange('role', role)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                          formData.role === role
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Name Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First name"
                        className="pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last name"
                        className="pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Email & Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Phone className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone"
                        className="pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Password Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password"
                        className="pl-10 pr-10 w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <AnimatedIcon size="sm" animation="pulse" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-4 h-4" />
                      </AnimatedIcon>
                      <AnimatedInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 w-full"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Terms Agreement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex items-start space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    required
                  />
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <button type="button" className="text-green-600 hover:text-green-500 font-medium underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-green-600 hover:text-green-500 font-medium underline">
                      Privacy Policy
                    </button>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <AnimatedButton
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </AnimatedButton>
                </motion.div>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="text-center"
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-green-600 hover:text-green-500 font-semibold hover:underline transition-all duration-300"
                    >
                      Sign in here
                    </button>
                  </p>
                </motion.div>
              </form>
            </AnimatedCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
