import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, UserPlus, Heart,
  Stethoscope, Shield, Sparkles, Users, TrendingUp, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { ChatBotTrigger } from '../components/ChatBot';

export function SignupPage() {
  const { signup } = useAuth();
  const { resolvedTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'patient' as 'admin' | 'doctor' | 'patient',
    specialization: '',
    licenseNumber: '',
    experience: '',
    dateOfBirth: '',
    gender: 'other' as 'male' | 'female' | 'other',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare profile data matching backend expectations
      const profileData: any = {};
      
      if (formData.role === 'doctor') {
        profileData.phone = '';
        profileData.specialization = formData.specialization;
        profileData.licenseNumber = formData.licenseNumber;
        profileData.experience = parseInt(formData.experience) || 0;
        profileData.qualification = '';
        profileData.consultationFee = 0;
        profileData.availability = '';
        profileData.bio = '';
      } else if (formData.role === 'patient') {
        profileData.phone = '';
        profileData.dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date().toISOString();
        profileData.gender = formData.gender;
        profileData.address = '';
        profileData.emergencyContact = '';
        profileData.emergencyPhone = '';
        profileData.medicalHistory = '';
        profileData.allergies = '';
        profileData.currentMedications = '';
      }

      const result = await signup({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        ...profileData,
      });

      if (result.success) {
        if (result.requiresVerification) {
          // Show success message for email verification
          setError(''); // Clear any previous errors
          // You could set a success state here instead of using error state
          alert(result.message || 'Please check your email to verify your account before signing in.');
          // Optionally redirect to login page
          // navigate('/login');
        } else {
          // Account created successfully without verification needed
          alert('Account created successfully!');
          // navigate('/login');
        }
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };


  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } relative overflow-hidden`}>
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'
        } bg-[size:50px_50px]`} />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)]'
              : 'bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)]'
          } bg-[size:30px_30px]`}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                G1Cure
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Already have an account?
              </span>
              <Link to="/login">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
          {/* Centered Signup Form */}
          <div className="relative w-full max-w-md">
            <div className={`${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Join G1Cure</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">
                  Create your account
                </h1>
                <p className={`text-lg ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Start your healthcare journey with the most advanced platform
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    I am a
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Conditional Fields for Doctor Role */}
                {formData.role === 'doctor' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Stethoscope className="w-4 h-4" />
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          }`}
                          placeholder="Cardiology"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Shield className="w-4 h-4" />
                          License Number
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          }`}
                          placeholder="MD12345"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                        }`}
                        placeholder="5"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields for Patient Role */}
                {formData.role === 'patient' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <User className="w-4 h-4" />
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatBotTrigger />
    </div>
  );
}
