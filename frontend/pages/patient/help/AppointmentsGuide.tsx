import React from 'react';
import {
  ArrowLeft, Calendar, Clock, User, Video, Phone,
  CheckCircle, AlertCircle, FileText, Download,
  Star, Shield, Bell, MapPin
} from 'lucide-react';
import { ThemeToggle } from '../../../contexts/ThemeContext';

export function AppointmentsGuide() {
  const appointmentTypes = [
    {
      title: 'In-Person Consultation',
      description: 'Traditional face-to-face appointments at our medical facility',
      icon: User,
      color: 'from-blue-500 to-indigo-500',
      duration: '30-60 minutes',
      features: ['Physical examination', 'Direct interaction with doctor', 'Immediate testing if needed', 'Personal touch']
    },
    {
      title: 'Telemedicine Session',
      description: 'Virtual appointments conducted via secure video calls',
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      duration: '15-30 minutes',
      features: ['Convenient from home', 'Secure video platform', 'Prescription management', 'Follow-up consultations']
    },
    {
      title: 'Phone Consultation',
      description: 'Quick consultations over the phone for simple issues',
      icon: Phone,
      color: 'from-emerald-500 to-teal-500',
      duration: '10-20 minutes',
      features: ['Quick check-ins', 'Prescription refills', 'Simple questions', 'Urgent concerns']
    }
  ];

  const bookingSteps = [
    {
      step: 1,
      title: 'Choose Your Doctor',
      description: 'Browse our directory of healthcare providers by specialty, location, or availability.',
      icon: User,
      details: [
        'View doctor profiles and specialties',
        'Check availability and ratings',
        'Read patient reviews',
        'Select your preferred provider'
      ]
    },
    {
      step: 2,
      title: 'Select Date & Time',
      description: 'Pick from available time slots that work with your schedule.',
      icon: Calendar,
      details: [
        'View real-time availability',
        'Choose from multiple time slots',
        'Consider appointment type duration',
        'Check for any conflicts'
      ]
    },
    {
      step: 3,
      title: 'Choose Appointment Type',
      description: 'Decide between in-person, telemedicine, or phone consultation.',
      icon: Video,
      details: [
        'Consider your health needs',
        'Check insurance coverage',
        'Evaluate convenience factors',
        'Select appropriate type'
      ]
    },
    {
      step: 4,
      title: 'Confirm & Prepare',
      description: 'Review your appointment details and prepare for your visit.',
      icon: CheckCircle,
      details: [
        'Review appointment confirmation',
        'Prepare your questions',
        'Gather relevant documents',
        'Set reminders'
      ]
    }
  ];

  const preparationTips = [
    {
      category: 'Before Your Appointment',
      icon: FileText,
      tips: [
        'Write down your symptoms and concerns',
        'Prepare a list of current medications',
        'Bring your insurance card and ID',
        'Arrive 15 minutes early',
        'Bring any relevant test results'
      ]
    },
    {
      category: 'During Your Appointment',
      icon: User,
      tips: [
        'Be honest about your symptoms',
        'Ask questions if something is unclear',
        'Take notes during the discussion',
        'Discuss treatment options',
        'Ask about follow-up care'
      ]
    },
    {
      category: 'After Your Appointment',
      icon: CheckCircle,
      tips: [
        'Review your treatment plan',
        'Schedule follow-up appointments if needed',
        'Fill prescriptions promptly',
        'Follow doctor\'s instructions',
        'Contact us if you have questions'
      ]
    }
  ];

  const commonQuestions = [
    {
      question: 'How far in advance can I book an appointment?',
      answer: 'You can book appointments up to 3 months in advance. For urgent care, same-day appointments may be available.'
    },
    {
      question: 'Can I reschedule or cancel my appointment?',
      answer: 'Yes, you can reschedule or cancel appointments up to 24 hours before the scheduled time through your patient portal.'
    },
    {
      question: 'What if I need to see a specialist?',
      answer: 'We can help you find and book appointments with specialists. Some may require a referral from your primary care doctor.'
    },
    {
      question: 'How do I prepare for a telemedicine appointment?',
      answer: 'Ensure you have a stable internet connection, good lighting, and a quiet space. Test your camera and microphone beforehand.'
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
                  Managing Your Appointments
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  Everything you need to know about scheduling and managing your healthcare appointments
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
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Your Healthcare, Your Schedule
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Booking and managing your healthcare appointments should be simple and convenient. 
                  Our platform offers multiple appointment types and flexible scheduling options to 
                  fit your lifestyle and healthcare needs.
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>6 min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Essential guide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Types */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Types of Appointments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {appointmentTypes.map((type, index) => (
              <div
                key={index}
                className="relative group hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {type.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {type.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{type.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Process */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              How to Book an Appointment
            </h2>
            <div className="space-y-8">
              {bookingSteps.map((step, index) => (
                <div
                  key={step.step}
                  className="flex items-start space-x-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 p-4 rounded-xl transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                        {step.step}
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
              ))}
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Preparation Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preparationTips.map((category, index) => (
              <div
                key={index}
                className="relative group hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {commonQuestions.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
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
              Ready to Book Your Appointment?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Schedule your next healthcare appointment in just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/patient/appointments'}
                className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Book Appointment
              </button>
              <button
                onClick={() => window.location.href = '/patient/telemedicine'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Schedule Telemedicine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
