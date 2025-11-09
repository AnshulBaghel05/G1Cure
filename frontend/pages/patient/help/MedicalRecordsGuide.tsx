import React from 'react';
import {
  ArrowLeft, FileText, Download, Eye, Calendar,
  User, Stethoscope, Activity, AlertCircle, CheckCircle,
  Clock, Shield, Star, TrendingUp
} from 'lucide-react';
import { ThemeToggle } from '../../../contexts/ThemeContext';

export function MedicalRecordsGuide() {
  const recordTypes = [
    {
      title: 'Lab Results',
      description: 'Blood tests, urine tests, and other laboratory findings',
      icon: Activity,
      color: 'from-blue-500 to-indigo-500',
      examples: ['Complete Blood Count (CBC)', 'Cholesterol Panel', 'Blood Glucose', 'Thyroid Function']
    },
    {
      title: 'Imaging Reports',
      description: 'X-rays, MRIs, CT scans, and ultrasound results',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      examples: ['Chest X-ray', 'MRI Brain', 'CT Abdomen', 'Echocardiogram']
    },
    {
      title: 'Prescriptions',
      description: 'Current and past medications prescribed by your doctors',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      examples: ['Blood Pressure Medication', 'Antibiotics', 'Pain Management', 'Vitamins']
    },
    {
      title: 'Visit Notes',
      description: 'Detailed notes from your doctor visits and consultations',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      examples: ['Consultation Summary', 'Treatment Plan', 'Follow-up Instructions', 'Diagnosis Notes']
    }
  ];

  const understandingResults = [
    {
      title: 'Normal vs. Abnormal Values',
      description: 'Learn how to interpret test results and understand what normal ranges mean for your health.',
      tips: [
        'Normal ranges vary by age, gender, and health conditions',
        'Some results may be slightly outside normal but not concerning',
        'Always discuss results with your healthcare provider',
        'Trends over time are often more important than single values'
      ]
    },
    {
      title: 'Common Medical Terms',
      description: 'Familiarize yourself with frequently used medical terminology in your records.',
      tips: [
        'Use the glossary feature for definitions',
        'Ask your doctor to explain unfamiliar terms',
        'Keep a personal health journal',
        'Don\'t hesitate to ask questions'
      ]
    },
    {
      title: 'Tracking Your Health',
      description: 'Use your medical records to monitor your health progress and identify patterns.',
      tips: [
        'Review results regularly with your healthcare team',
        'Look for trends and patterns over time',
        'Set health goals based on your data',
        'Share relevant information with all your providers'
      ]
    }
  ];

  const securityFeatures = [
    {
      title: 'HIPAA Compliance',
      description: 'Your health information is protected by strict privacy regulations.',
      icon: Shield
    },
    {
      title: 'Encrypted Storage',
      description: 'All data is encrypted both in transit and at rest.',
      icon: FileText
    },
    {
      title: 'Access Controls',
      description: 'Only you and authorized healthcare providers can access your records.',
      icon: User
    },
    {
      title: 'Audit Trail',
      description: 'Track who has accessed your information and when.',
      icon: Activity
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
                  Understanding Your Medical Records
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  A comprehensive guide to reading and interpreting your medical records
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Your Health Information Hub
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Your medical records contain valuable information about your health journey. Understanding 
                  these records empowers you to make informed decisions about your care and communicate 
                  effectively with your healthcare team.
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Essential knowledge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Types of Medical Records */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Types of Medical Records
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recordTypes.map((record, index) => (
              <div
                key={index}
                className="relative group hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${record.color} flex items-center justify-center shadow-lg`}>
                      <record.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {record.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {record.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Examples:</h4>
                    <ul className="space-y-1">
                      {record.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Understanding Your Results */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Understanding Your Results
            </h2>
            <div className="space-y-8">
              {understandingResults.map((section, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {section.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Key Tips:</h4>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-400">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Your Privacy & Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
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
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore Your Records?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Access your medical records and take control of your health information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/patient/medical-records'}
                className="bg-white text-emerald-600 hover:bg-slate-100 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                View My Records
              </button>
              <button
                onClick={() => window.location.href = '/patient/help'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Get More Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
