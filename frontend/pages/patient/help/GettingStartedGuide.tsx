import React from 'react';
import {
  ArrowLeft, BookOpen, CheckCircle, Clock, User,
  Calendar, CreditCard, FileText, Shield, Star
} from 'lucide-react';
import { ThemeToggle } from '../../../contexts/ThemeContext';

export function GettingStartedGuide() {
  const steps = [
    {
      id: 1,
      title: 'Create Your Account',
      description: 'Sign up with your email address and create a secure password.',
      icon: User,
      details: [
        'Enter your personal information',
        'Verify your email address',
        'Set up two-factor authentication for extra security',
        'Complete your health profile'
      ]
    },
    {
      id: 2,
      title: 'Complete Your Profile',
      description: 'Add your medical history, insurance information, and emergency contacts.',
      icon: FileText,
      details: [
        'Upload your insurance card',
        'Add your medical history',
        'List current medications',
        'Set emergency contacts'
      ]
    },
    {
      id: 3,
      title: 'Book Your First Appointment',
      description: 'Find and schedule an appointment with a healthcare provider.',
      icon: Calendar,
      details: [
        'Browse available doctors by specialty',
        'Select your preferred date and time',
        'Choose between in-person or telemedicine',
        'Receive confirmation and reminders'
      ]
    },
    {
      id: 4,
      title: 'Manage Your Health',
      description: 'Access your medical records, view test results, and track your health.',
      icon: Shield,
      details: [
        'View lab results and medical reports',
        'Track your medications',
        'Monitor your health metrics',
        'Communicate with your healthcare team'
      ]
    }
  ];

  const features = [
    {
      title: 'Secure & Private',
      description: 'Your health data is protected with bank-level encryption and HIPAA compliance.',
      icon: Shield
    },
    {
      title: '24/7 Access',
      description: 'Access your health information anytime, anywhere with our mobile-friendly platform.',
      icon: Clock
    },
    {
      title: 'Easy Communication',
      description: 'Message your doctors, schedule appointments, and get reminders all in one place.',
      icon: Calendar
    },
    {
      title: 'Comprehensive Records',
      description: 'Keep all your medical records, test results, and treatment plans organized.',
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl px-4 py-2 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Getting Started with G1Cure
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  Learn the basics of using our healthcare platform
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Introduction */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Welcome to G1Cure
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  G1Cure is your comprehensive healthcare platform that puts you in control of your health. 
                  From booking appointments to managing medical records, we've designed everything with your 
                  convenience and privacy in mind.
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Beginner friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Steps */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Getting Started in 4 Easy Steps
          </h2>
          
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-8 rounded-2xl">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                        {step.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Why Choose G1Cure?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of patients who trust G1Cure with their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/patient/appointments'}
                className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Book Your First Appointment
              </button>
              <button
                onClick={() => window.location.href = '/patient/medical-records'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                View Medical Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
