import React from 'react';
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
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40'
    } relative overflow-hidden pt-20`}>
      {/* Enhanced Medical Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]'
        }`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(59,130,246,0.03)_2px,transparent_2px)] bg-[size:100px_100px]" />
      </div>

      {/* Floating Healthcare Icons with Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[5%] animate-float opacity-[0.06]">
          <HeartPulse className={`w-20 h-20 ${isDark ? 'text-red-400' : 'text-red-300'}`} />
        </div>
        <div className="absolute top-32 right-[8%] animate-float-delay-1 opacity-[0.06]">
          <Stethoscope className={`w-24 h-24 ${isDark ? 'text-blue-400' : 'text-blue-300'}`} />
        </div>
        <div className="absolute top-[45%] left-[10%] animate-float-delay-2 opacity-[0.06]">
          <Microscope className={`w-16 h-16 ${isDark ? 'text-purple-400' : 'text-purple-300'}`} />
        </div>
        <div className="absolute bottom-32 right-[12%] animate-float-delay-3 opacity-[0.06]">
          <BrainCircuit className={`w-22 h-22 ${isDark ? 'text-emerald-400' : 'text-emerald-300'}`} />
        </div>
        <div className="absolute top-[60%] right-[5%] animate-float opacity-[0.06]">
          <Activity className={`w-18 h-18 ${isDark ? 'text-cyan-400' : 'text-cyan-300'}`} />
        </div>
        <div className="absolute bottom-40 left-[15%] animate-float-delay-1 opacity-[0.06]">
          <Shield className={`w-20 h-20 ${isDark ? 'text-indigo-400' : 'text-indigo-300'}`} />
        </div>
      </div>

      {/* Gradient Orbs for Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'
        }`} />
        <div className={`absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full blur-[140px] ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-400/10'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-[550px] h-[550px] rounded-full blur-[130px] ${
          isDark ? 'bg-teal-600/10' : 'bg-teal-400/10'
        }`} />
      </div>

      <div className="space-y-16 relative z-10">
        {/* Hero Section - Enhanced */}
        <section className="px-4 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-xl rounded-full border border-blue-500/20 shadow-lg">
                <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className={`text-sm font-semibold ${
                  isDark ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  AI-Powered Healthcare Platform • HIPAA Compliant
                </span>
              </div>

              {/* Main Heading with Medical Icons */}
              <div className="relative">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold leading-tight tracking-tight">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <HeartPulse className={`w-16 h-16 md:w-20 md:h-20 ${
                      isDark ? 'text-red-400' : 'text-red-500'
                    } animate-pulse`} />
                    <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Transform
                    </span>
                  </div>
                  <div className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                      Healthcare
                    </span>
                    {/* Underline effect */}
                    <div className={`absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full ${
                      isDark ? 'opacity-50' : 'opacity-30'
                    }`} />
                  </div>
                  <div className="mt-4">
                    <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Management
                    </span>
                  </div>
                </h1>
              </div>

              {/* Subheading */}
              <p className={`text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed font-light ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                The complete platform for modern healthcare providers. Powered by{' '}
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI
                </span>
                , built for{' '}
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  excellence
                </span>
                .
              </p>

              {/* Key Features Pills */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {['AI Chatbot', 'Telemedicine', 'Analytics', 'Appointments', 'Billing'].map((feature, index) => (
                  <div
                    key={feature}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105 ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-blue-500/50'
                        : 'bg-white/80 border-slate-200 text-slate-700 hover:border-blue-500/50'
                    }`}
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
                <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] hover:bg-right-bottom text-white rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 text-lg flex items-center gap-3 hover:scale-105 hover:-translate-y-1 border border-blue-500/50">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free 30-Day Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className={`px-10 py-5 border-2 rounded-2xl font-semibold transition-all duration-300 text-lg flex items-center gap-3 hover:scale-105 hover:-translate-y-1 ${
                  isDark
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500'
                    : 'border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400'
                }`}>
                  <Play className="w-6 h-6" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className={`flex flex-wrap justify-center items-center gap-8 pt-12 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Healthcare Leader 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">Trusted by Thousands</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Platform Impact
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <div key={stat.label} className="relative group text-center">
                  <div className={`p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-3 hover:scale-105 backdrop-blur-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-slate-600/80 hover:shadow-2xl hover:shadow-blue-500/10'
                      : 'bg-gradient-to-br from-white to-blue-50/30 border-slate-200/80 hover:border-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/20'
                  }`}>
                    {/* Icon with gradient background */}
                    <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <stat.icon className="w-10 h-10 text-white relative z-10" />
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                    </div>

                    {/* Number */}
                    <div className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.number}
                    </div>

                    {/* Label */}
                    <div className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {stat.label}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 -z-10`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Comprehensive Healthcare Suite</span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Enterprise-Grade Features
              </h2>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Everything you need to deliver exceptional patient care and streamline operations
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="relative group">
                  <div className={`h-full p-10 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] backdrop-blur-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 hover:border-slate-600/80 hover:shadow-2xl'
                      : 'bg-gradient-to-br from-white to-blue-50/40 border-slate-200/80 hover:border-blue-300/50 hover:shadow-2xl'
                  }`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] overflow-hidden rounded-3xl">
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl animate-pulse`} />
                      <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl animate-pulse delay-75`} />
                    </div>

                    <div className="relative z-10">
                      {/* Icon with enhanced styling */}
                      <div className={`relative w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <feature.icon className="w-12 h-12 text-white relative z-10" />
                        {/* Glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                      </div>

                      {/* Category Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 ${
                        isDark
                          ? 'bg-slate-700/50 border-slate-600 text-slate-300'
                          : 'bg-white/80 border-slate-200 text-slate-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {feature.category}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-base md:text-lg leading-relaxed mb-8 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {feature.description}
                      </p>

                      {/* Benefits List */}
                      <div className="space-y-4">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefit} className="flex items-start gap-3 group/item">
                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg transition-transform duration-300 group-hover/item:scale-110`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Enterprise Badge */}
                      {feature.enterprise && (
                        <div className={`mt-8 pt-6 border-t ${
                          isDark ? 'border-slate-700/50' : 'border-slate-200/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className={`w-4 h-4 ${
                                isDark ? 'text-purple-400' : 'text-purple-600'
                              }`} />
                              <span className={`text-xs font-semibold ${
                                isDark ? 'text-purple-400' : 'text-purple-600'
                              }`}>
                                Enterprise Ready
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced 3D Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-15 blur-3xl transition-all duration-500 -z-10`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}>
                <Cpu className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-medium">Cutting-Edge Technology</span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Built for Performance
              </h2>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Leveraging modern technologies to deliver unmatched speed, security, and reliability
              </p>
            </div>

            {/* Technology Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <div key={tech.title} className="relative group">
                  <div className={`h-full p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-3 hover:scale-105 backdrop-blur-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 hover:border-slate-600/80 hover:shadow-2xl hover:shadow-blue-500/10'
                      : 'bg-gradient-to-br from-white to-blue-50/40 border-slate-200/80 hover:border-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/20'
                  }`}>
                    {/* Icon */}
                    <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <tech.icon className="w-10 h-10 text-white relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 text-center ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {tech.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm mb-6 text-center ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {tech.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {tech.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 shadow-lg" />
                          <span className={`text-xs font-medium ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 -z-10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white/80 border-slate-200 text-slate-700'
              }`}>
                <Users className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">Trusted by Professionals</span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Healthcare Leaders Love Us
              </h2>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Join thousands of healthcare providers transforming patient care
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.name} className="relative group">
                  <div className={`h-full p-10 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] backdrop-blur-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 hover:border-slate-600/80 hover:shadow-2xl'
                      : 'bg-gradient-to-br from-white to-blue-50/40 border-slate-200/80 hover:border-blue-300/50 hover:shadow-2xl'
                  }`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] overflow-hidden rounded-3xl">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-2xl animate-pulse delay-75" />
                    </div>

                    <div className="relative z-10 space-y-6">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className={`text-lg md:text-xl leading-relaxed font-medium ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        "{testimonial.content}"
                      </p>

                      {/* Divider */}
                      <div className={`w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500`} />

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {testimonial.name}
                          </h3>
                          <p className={`text-sm font-medium ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {testimonial.specialty}
                          </p>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      {testimonial.verified && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                          isDark
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        }`}>
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-sm font-semibold">Verified Healthcare Provider</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 -z-10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-[2rem]">
              {/* Dynamic Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600" />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-slate-900/40" />

              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[120px] animate-pulse delay-150" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[140px] animate-pulse delay-300" />
              </div>

              {/* Medical Pattern Overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[size:60px_60px]" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-12 md:p-20 lg:p-24 text-center text-white">
                <div className="space-y-10 max-w-5xl mx-auto">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>

                  {/* Heading */}
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                    Ready to Revolutionize
                    <br />
                    <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Your Healthcare Practice?
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed font-light">
                    Join 10,000+ healthcare providers delivering exceptional patient care with G1Cure
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                    <button className="group px-12 py-6 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300 text-lg flex items-center gap-4 hover:scale-105 hover:-translate-y-1">
                      <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      Start Free 30-Day Trial
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button className="px-12 py-6 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white bg-transparent backdrop-blur-xl rounded-2xl font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300 text-lg flex items-center gap-4 hover:scale-105 hover:-translate-y-1">
                      <Play className="w-6 h-6" />
                      Watch 2-Min Demo
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-12 mt-12 border-t border-white/20">
                    <p className="text-white/80 mb-8 text-lg font-medium">
                      Trusted by Leading Healthcare Organizations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">HIPAA</div>
                          <div className="text-xs opacity-75">Compliant</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">SOC 2</div>
                          <div className="text-xs opacity-75">Certified</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">99.9%</div>
                          <div className="text-xs opacity-75">Uptime</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                          <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">4.9/5</div>
                          <div className="text-xs opacity-75">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <ChatBotTrigger />
    </div>
  );
}
