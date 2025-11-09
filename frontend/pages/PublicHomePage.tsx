import React from 'react';
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
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { ChatBotTrigger } from '../components/ChatBot';

export function PublicHomePage() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const isDark = resolvedTheme === 'dark';

  const features = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Bank-level security with end-to-end encryption',
      gradient: 'from-emerald-500 to-teal-500',
      delay: 0.1,
      category: 'Security',
      enterprise: true,
      benefits: ['Patient Data Protection', 'Audit Trails', 'Access Controls']
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Machine learning for predictive healthcare analytics',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2,
      category: 'Intelligence',
      enterprise: true,
      benefits: ['Predictive Analytics', 'Risk Assessment', 'Treatment Recommendations']
    },
    {
      icon: Cloud,
      title: 'Cloud Native',
      description: 'Built for modern healthcare infrastructure',
      gradient: 'from-blue-500 to-indigo-500',
      delay: 0.3,
      category: 'Infrastructure',
      enterprise: true,
      benefits: ['Scalability', 'High Availability', 'Global Access']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination across departments',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4,
      category: 'Workflow',
      enterprise: true,
      benefits: ['Real-time Updates', 'Role-based Access', 'Communication Tools']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and business intelligence',
      gradient: 'from-cyan-500 to-blue-500',
      delay: 0.5,
      category: 'Analytics',
      enterprise: true,
      benefits: ['Performance Metrics', 'Financial Reports', 'Patient Outcomes']
    },
    {
      icon: Rocket,
      title: 'Telemedicine Suite',
      description: 'Full-featured virtual care platform',
      gradient: 'from-violet-500 to-purple-500',
      delay: 0.6,
      category: 'Care Delivery',
      enterprise: true,
      benefits: ['Video Consultations', 'Remote Monitoring', 'Digital Prescriptions']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Healthcare Providers', icon: Stethoscope, gradient: 'from-blue-500 to-indigo-500' },
    { number: '500,000+', label: 'Patients Served', icon: Heart, gradient: 'from-emerald-500 to-teal-500' },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Activity, gradient: 'from-purple-500 to-pink-500' },
    { number: '24/7', label: 'Support Available', icon: Clock, gradient: 'from-orange-500 to-red-500' },
    { number: '50+', label: 'Integrations', icon: Network, gradient: 'from-cyan-500 to-blue-500' },
    { number: '100%', label: 'HIPAA Compliant', icon: Shield, gradient: 'from-green-500 to-emerald-500' }
  ];

  const technologies = [
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Advanced algorithms for healthcare insights',
      features: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision']
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Scalable and secure cloud platform',
      features: ['AWS/Azure Integration', 'Auto-scaling', 'Global CDN']
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security measures',
      features: ['End-to-end Encryption', 'SOC 2 Type II', 'GDPR Compliance']
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Robust data handling and analytics',
      features: ['Real-time Processing', 'Data Warehousing', 'API Integration']
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      content: 'G1Cure has transformed our practice. The AI insights help us make better treatment decisions.',
      rating: 5,
      verified: true,
      avatar: 'user'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrician',
      content: 'The telemedicine features are incredible. Our patients love the convenience.',
      rating: 5,
      verified: true,
      avatar: 'user'
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Family Medicine',
      content: 'Finally, a platform that understands healthcare workflows. It just works.',
      rating: 5,
      verified: true,
      avatar: 'user'
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
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Next-Generation Healthcare Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                Revolutionizing
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                Healthcare
              </span>
              <br />
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                with AI
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
              G1Cure is the most advanced healthcare SaaS platform, combining artificial intelligence, 
              telemedicine, and comprehensive practice management to deliver exceptional patient care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl font-medium transition-all duration-300 text-lg flex items-center gap-3"
              >
                <ArrowRight className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Statistics Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
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
                  <div className={`p-6 rounded-2xl border transition-all duration-500 ${
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
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div className={`text-3xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Features Section */}
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
                Platform Features
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Everything you need to run a modern, efficient healthcare practice
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: feature.delay,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl`} />
                      <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl`} />
                    </div>

                    <div className="relative z-10">
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
                        className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl`}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-4">
                          <span className={`text-xs font-medium ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {feature.category}
                          </span>
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-lg leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.div
                            key={benefit}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + benefitIndex * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-sm ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {benefit}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3D Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10`} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technology Stack Section */}
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
                Built with Modern Technology
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Leveraging cutting-edge technologies for optimal performance and security
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.title}
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
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg`}
                    >
                      <tech.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 text-center ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {tech.title}
                    </h3>
                    <p className={`text-sm mb-4 text-center ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {tech.description}
                    </p>

                    <div className="space-y-2">
                      {tech.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className={`text-xs ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Testimonials Section */}
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
                Trusted by Healthcare Leaders
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                See what healthcare professionals are saying about G1Cure
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-2xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {testimonial.name}
                          </h3>
                          <p className={`text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {testimonial.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className={`text-lg leading-relaxed mb-4 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        "{testimonial.content}"
                      </p>

                      {testimonial.verified && (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified User</span>
                        </div>
                      )}
                    </div>
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
                    Ready to Transform Your Practice?
                  </motion.h2>
                  <motion.p 
                    className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Join thousands of healthcare providers who trust G1Cure to power their practice
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

                  {/* Trust Indicators */}
                  <motion.div 
                    className="pt-8 border-t border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-slate-300 mb-6">Trusted by leading healthcare organizations</p>
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
