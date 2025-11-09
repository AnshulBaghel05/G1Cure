import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Heart,
  Activity,
  Zap,
  CheckCircle,
  TrendingUp,
  Lock,
  Globe,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Brain,
  Database,
  Network,
  Cpu,
  Server,
  Cloud,
  Wifi,
  Eye,
  Fingerprint,
  ShieldCheck,
  ActivitySquare,
  Stethoscope,
  Microscope,
  Pill,
  Syringe,
  HeartPulse,
  BrainCircuit,
  CircuitBoard,
  Layers,
  Box,
  Octagon,
  Sparkles,
  Users,
  ArrowRight,
  Play,
  Star,
  Building2,
  Shield,
  BarChart3,
  Rocket,
  Target,
  Check,
  X,
  Crown,
  Star as StarIcon,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CheckCircle as CheckCircleIcon,
  XCircle,
  PlusCircle,
  MinusCircle,
  X as XIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Divide,
  Percent,
  Hash,
  AtSign,
  Hash as HashIcon,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  CreditCard as CreditCardIcon,
  Wallet,
  Banknote,
  Coins,
  PiggyBank,
  Shield,
  Vault,
  Lock as LockIcon,
  Unlock,
  Key,
  Eye as EyeIcon,
  EyeOff,
  Fingerprint as FingerprintIcon,
  Scan,
  QrCode,
  Barcode,
  CreditCard as CreditCardIcon2,
  Wallet as WalletIcon,
  DollarSign as DollarSignIcon,
  Euro as EuroIcon,
  PoundSterling as PoundSterlingIcon,
  DollarSign as DollarIcon,
  Bitcoin as BitcoinIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  BarChart3 as BarChart3Icon,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Radar,
  Target as TargetIcon,
  Flag,
  Award as AwardIcon,
  Trophy,
  Medal,
  Crown as CrownIcon,
  Star as StarIcon2,
  Heart as HeartIcon2,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  CheckCircle as CheckCircleIcon2,
  XCircle as XCircleIcon,
  PlusCircle as PlusCircleIcon,
  MinusCircle as MinusCircleIcon,
  X as XIcon2,
  Plus as PlusIcon2,
  Minus as MinusIcon2,
  Divide as DivideIcon,
  Percent as PercentIcon,
  Hash as HashIcon2,
  AtSign as AtSignIcon,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { ChatBotTrigger } from '../components/ChatBot';

export function PricingPage() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const isDark = resolvedTheme === 'dark';

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small practices getting started',
      price: billingCycle === 'monthly' ? 99 : 990,
      originalPrice: billingCycle === 'monthly' ? 129 : 1290,
      features: [
        'Up to 10 providers',
        'Basic telemedicine',
        'Patient management',
        'Email support',
        'HIPAA compliance',
        'Mobile app access'
      ],
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
      icon: Users
    },
    {
      name: 'Professional',
      description: 'Ideal for growing healthcare organizations',
      price: billingCycle === 'monthly' ? 299 : 2990,
      originalPrice: billingCycle === 'monthly' ? 399 : 3990,
      features: [
        'Up to 50 providers',
        'Advanced telemedicine',
        'AI medical assistant',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'Training sessions',
        'Dedicated account manager'
      ],
      popular: true,
      gradient: 'from-blue-500 to-purple-500',
      icon: Star
    },
    {
      name: 'Enterprise',
      description: 'For large healthcare systems and hospitals',
      price: 'Custom',
      originalPrice: null,
      features: [
        'Unlimited providers',
        'Full AI suite',
        'Custom development',
        '24/7 phone support',
        'On-site training',
        'White-label options',
        'Advanced security',
        'Compliance consulting'
      ],
      popular: false,
      gradient: 'from-emerald-500 to-teal-500',
      icon: Crown
    }
  ];

  const addons = [
    {
      name: 'AI Medical Assistant Pro',
      description: 'Advanced AI-powered diagnostic support',
      price: billingCycle === 'monthly' ? 49 : 490,
      features: ['Advanced diagnostics', 'Treatment recommendations', 'Medical literature access']
    },
    {
      name: 'Advanced Analytics',
      description: 'Comprehensive business intelligence suite',
      price: billingCycle === 'monthly' ? 79 : 790,
      features: ['Custom reports', 'Predictive analytics', 'Performance dashboards']
    },
    {
      name: 'Custom Integrations',
      description: 'Seamless integration with your existing systems',
      price: billingCycle === 'monthly' ? 99 : 990,
      features: ['API development', 'Third-party integrations', 'Custom workflows']
    },
    {
      name: 'Priority Support',
      description: 'Dedicated support team for your organization',
      price: billingCycle === 'monthly' ? 149 : 1490,
      features: ['24/7 phone support', 'Dedicated manager', 'Response time guarantee']
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Bank-level security with end-to-end encryption'
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      description: 'Reliable platform you can count on'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Expert help whenever you need it'
    },
    {
      icon: Rocket,
      title: 'Free Migration',
      description: 'We handle the transition for you'
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } relative overflow-hidden pt-20`}>
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'
        } bg-[size:50px_50px]`} />
        <motion.div
          style={{ y: backgroundY }}
          className={`absolute inset-0 ${
            isDark 
              ? 'bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)]'
          } bg-[size:30px_30px]`}
        />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-10"
        >
          <Box className={`${isDark ? 'text-blue-400' : 'text-blue-300'}`} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 text-5xl opacity-10"
        >
          <Octagon className={`${isDark ? 'text-purple-400' : 'text-purple-300'}`} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-20 text-4xl opacity-10"
        >
          <Layers className={`${isDark ? 'text-emerald-400' : 'text-emerald-300'}`} />
        </motion.div>
      </div>

      <div className="space-y-16 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Pricing Plans</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                Simple, Transparent
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-12 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Choose the perfect plan for your healthcare practice. All plans include 
              our core features with no hidden fees.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className={`text-lg font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  billingCycle === 'yearly' ? 'bg-blue-500' : 'bg-slate-400'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
              <span className={`text-lg font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Yearly
                <span className="ml-2 text-sm text-emerald-500 font-medium">
                  Save 20%
                </span>
              </span>
            </motion.div>
          </div>
        </motion.section>

        {/* Pricing Plans Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className={`relative group ${
                    plan.popular ? 'md:-mt-8 md:mb-8' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30'
                      : isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                        : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    <div className="text-center mb-8">
                      <motion.div
                        whileHover={{ 
                          rotateY: 360,
                          scale: 1.1,
                        }}
                        transition={{ 
                          duration: 0.8,
                          type: "spring",
                          stiffness: 200
                        }}
                        className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-2xl`}
                      >
                        <plan.icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <h3 className={`text-3xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className={`text-lg mb-6 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        {typeof plan.price === 'number' ? (
                          <div className="flex items-baseline justify-center gap-2">
                            <span className={`text-5xl font-bold ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              ${plan.price}
                            </span>
                            <span className={`text-lg ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              /{billingCycle === 'monthly' ? 'mo' : 'year'}
                            </span>
                          </div>
                        ) : (
                          <div className={`text-4xl font-bold ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {plan.price}
                          </div>
                        )}
                        
                        {plan.originalPrice && (
                          <div className="text-lg text-slate-500 line-through mt-2">
                            ${plan.originalPrice}/{billingCycle === 'monthly' ? 'mo' : 'year'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + featureIndex * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className={`text-sm ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                          : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Add-ons Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Additional Services
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Enhance your experience with our premium add-ons
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addons.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className={`h-full p-6 rounded-2xl border transition-all duration-500 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {addon.name}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {addon.description}
                    </p>

                    <div className="text-2xl font-bold mb-4 text-blue-500">
                      ${addon.price}/{billingCycle === 'monthly' ? 'mo' : 'year'}
                    </div>

                    <div className="space-y-2 mb-6">
                      {addon.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                          <span className={`text-xs ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl font-medium transition-all duration-300"
                    >
                      Add to Plan
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Why Choose G1Cure?
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Every plan includes these essential benefits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group text-center"
                >
                  <div className={`h-full p-6 rounded-2xl border transition-all duration-500 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    <motion.div
                      whileHover={{ 
                        rotateY: 360,
                        scale: 1.1,
                      }}
                      transition={{ 
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                    >
                      <benefit.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-blue-900 to-purple-900" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-blue-900/90 to-purple-900/90" />
              
              {/* Animated Background Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 opacity-10"
              >
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              </motion.div>

              <div className="relative z-10 p-16 md:p-20 text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-8 max-w-4xl mx-auto"
                >
                  <motion.h2 
                    className="text-4xl md:text-6xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Ready to Get Started?
                  </motion.h2>
                  <motion.p 
                    className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Join thousands of healthcare providers who trust G1Cure
                  </motion.p>
                  
                  {/* CTA Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                      }} 
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-0 text-lg"
                    >
                      <Rocket className="w-6 h-6 mr-3 inline" />
                      Start Free Trial
                    </motion.button>
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                      }} 
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="px-12 py-5 border-2 border-white text-white hover:bg-white/10 bg-transparent rounded-xl font-medium shadow-2xl hover:shadow-white/25 transition-all duration-300 text-lg"
                    >
                      <Target className="w-6 h-6 mr-3 inline" />
                      Schedule Demo
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
      <ChatBotTrigger />
    </div>
  );
}
