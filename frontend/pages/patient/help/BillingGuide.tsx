import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, DollarSign, FileText, Shield, 
  CheckCircle, AlertCircle, Download, Clock, User, 
  Star, Bell, TrendingUp, Receipt
} from 'lucide-react';
import { AnimatedButton } from '@/components/ui';
import { ThemeToggle } from '../../../contexts/ThemeContext';

export function BillingGuide() {
  const billingComponents = [
    {
      title: 'Service Charges',
      description: 'Fees for medical services, consultations, and procedures',
      icon: Receipt,
      color: 'from-blue-500 to-indigo-500',
      examples: ['Doctor consultation', 'Lab tests', 'Imaging studies', 'Procedures']
    },
    {
      title: 'Insurance Coverage',
      description: 'Amount covered by your health insurance plan',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500',
      examples: ['Primary insurance', 'Secondary insurance', 'Copayments', 'Deductibles']
    },
    {
      title: 'Patient Responsibility',
      description: 'Amount you need to pay out-of-pocket',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      examples: ['Copays', 'Deductibles', 'Coinsurance', 'Non-covered services']
    },
    {
      title: 'Payment Methods',
      description: 'Various ways to pay your medical bills',
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      examples: ['Credit cards', 'Debit cards', 'Bank transfers', 'Payment plans']
    }
  ];

  const paymentSteps = [
    {
      step: 1,
      title: 'Review Your Bill',
      description: 'Carefully review all charges and insurance adjustments on your statement.',
      icon: FileText,
      details: [
        'Check all service dates and descriptions',
        'Verify insurance payments and adjustments',
        'Look for any errors or discrepancies',
        'Understand what you owe and why'
      ]
    },
    {
      step: 2,
      title: 'Check Insurance',
      description: 'Ensure your insurance has been properly processed and applied.',
      icon: Shield,
      details: [
        'Verify insurance coverage for services',
        'Check if claims were submitted correctly',
        'Review explanation of benefits (EOB)',
        'Contact insurance if there are issues'
      ]
    },
    {
      step: 3,
      title: 'Choose Payment Method',
      description: 'Select the most convenient payment option for you.',
      icon: CreditCard,
      details: [
        'Credit or debit card',
        'Bank transfer or ACH',
        'Payment plan if needed',
        'Health savings account (HSA)'
      ]
    },
    {
      step: 4,
      title: 'Complete Payment',
      description: 'Process your payment and receive confirmation.',
      icon: CheckCircle,
      details: [
        'Enter payment information securely',
        'Review payment amount and details',
        'Submit payment',
        'Save receipt for your records'
      ]
    }
  ];

  const insuranceTips = [
    {
      category: 'Understanding Your Coverage',
      icon: Shield,
      tips: [
        'Know your deductible and how much you\'ve met',
        'Understand copay amounts for different services',
        'Check if services require prior authorization',
        'Verify network providers and facilities'
      ]
    },
    {
      category: 'Managing Costs',
      icon: DollarSign,
      tips: [
        'Use in-network providers when possible',
        'Ask about generic medication options',
        'Consider payment plans for large bills',
        'Keep track of medical expenses for taxes'
      ]
    },
    {
      category: 'Disputing Charges',
      icon: AlertCircle,
      tips: [
        'Review bills carefully for errors',
        'Contact billing department with questions',
        'Keep detailed records of all communications',
        'Escalate to patient advocate if needed'
      ]
    }
  ];

  const commonBillingQuestions = [
    {
      question: 'Why am I being charged when I have insurance?',
      answer: 'Even with insurance, you may have copays, deductibles, or coinsurance. Some services may not be covered by your plan.'
    },
    {
      question: 'Can I set up a payment plan?',
      answer: 'Yes, we offer flexible payment plans for larger bills. Contact our billing department to discuss options that work for your budget.'
    },
    {
      question: 'What if I can\'t afford to pay my bill?',
      answer: 'We have financial assistance programs available. Contact our patient financial services to discuss your options and eligibility.'
    },
    {
      question: 'How long do I have to pay my bill?',
      answer: 'Payment is typically due within 30 days of the statement date. Late fees may apply after this period.'
    }
  ];

  const securityFeatures = [
    {
      title: 'Secure Payment Processing',
      description: 'All payments are processed using industry-standard encryption and security protocols.',
      icon: Shield
    },
    {
      title: 'PCI Compliance',
      description: 'We maintain PCI DSS compliance to protect your payment information.',
      icon: CheckCircle
    },
    {
      title: 'Encrypted Storage',
      description: 'Your payment information is encrypted and stored securely.',
      icon: FileText
    },
    {
      title: 'Fraud Protection',
      description: 'Advanced fraud detection systems monitor all transactions.',
      icon: AlertCircle
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AnimatedButton
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help
              </AnimatedButton>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
                >
                  Billing and Insurance Guide
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-slate-600 dark:text-slate-300 mt-2"
                >
                  Navigate the complexities of medical billing and insurance claims
                </motion.p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Understanding Medical Billing
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Medical billing can be complex, but understanding the basics helps you make informed 
                  decisions about your healthcare costs. This guide will help you navigate insurance 
                  coverage, payment options, and billing processes.
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>10 min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Financial guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Billing Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Understanding Your Bill
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {billingComponents.map((component, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                <div className="relative p-6 rounded-2xl">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${component.color} flex items-center justify-center shadow-lg`}>
                      <component.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {component.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {component.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Examples:</h4>
                    <ul className="space-y-1">
                      {component.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              How to Pay Your Bill
            </h2>
            <div className="space-y-8">
              {paymentSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Insurance Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Insurance & Cost Management Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insuranceTips.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="relative group"
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Secure Payment Processing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {commonBillingQuestions.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Manage Your Bills?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Access your billing information and make payments securely online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={() => window.location.href = '/patient/billing'}
                className="bg-white text-purple-600 hover:bg-slate-100 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium"
              >
                View My Bills
              </AnimatedButton>
              <AnimatedButton
                onClick={() => window.location.href = '/patient/help'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium"
              >
                Contact Billing Support
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
