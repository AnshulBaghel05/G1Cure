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
  MessageSquare,
  Send,
  User,
  FileText,
  Calendar,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  Navigation,
  Compass,
  Wifi as WifiIcon,
  Signal,
  Battery,
  Clock as ClockIcon2,
  Calendar as CalendarIcon,
  User as UserIcon,
  UserCheck,
  UserX,
  Users as UsersIcon,
  UserPlus,
  UserMinus,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Unlock,
  Key,
  Eye as EyeIcon,
  EyeOff,
  Fingerprint as FingerprintIcon,
  Scan,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
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
  X,
  Plus,
  Minus,
  Divide,
  Percent,
  Hash,
  AtSign,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { ChatBotTrigger } from '../components/ChatBot';

export function ContactPage() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const isDark = resolvedTheme === 'dark';

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '24/7 dedicated healthcare support',
      contact: '+1 (555) 123-4567',
      gradient: 'from-blue-500 to-indigo-500',
      available: '24/7'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email anytime',
      contact: 'support@g1cure.com',
      gradient: 'from-emerald-500 to-teal-500',
      available: '24/7'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Instant support with our team',
      contact: 'Available on website',
      gradient: 'from-purple-500 to-pink-500',
      available: 'Business Hours'
    },
    {
      icon: Globe,
      title: 'Global Support',
      description: 'Worldwide healthcare assistance',
      contact: 'Multiple languages',
      gradient: 'from-orange-500 to-red-500',
      available: '24/7'
    }
  ];



  const socialMedia = [
    { platform: 'LinkedIn', icon: Linkedin, url: '#', followers: '50K+' },
    { platform: 'Twitter', icon: Twitter, url: '#', followers: '25K+' },
    { platform: 'Facebook', icon: Facebook, url: '#', followers: '30K+' },
    { platform: 'Instagram', icon: Instagram, url: '#', followers: '20K+' }
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
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Get in Touch</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                Let's Build the Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                Healthcare Together
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
              Ready to transform your healthcare practice? Our team is here to help you 
              every step of the way with personalized support and expert guidance.
            </motion.p>
          </div>
        </motion.section>

        {/* Contact Methods Section */}
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
                Get in Touch
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                We're here to help and answer any questions you might have
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
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
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 text-center ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {method.title}
                    </h3>
                    <p className={`text-sm mb-4 text-center ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {method.description}
                    </p>

                    <div className="text-center">
                      <div className={`text-lg font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {method.contact}
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {method.available}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Send Us a Message
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Have a question or need assistance? We'd love to hear from you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-2xl border ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/80 border-slate-200/50'
              }`}
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        isDark 
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Find answers to common questions about G1Cure
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: 'What is G1Cure and how does it work?',
                  answer: 'G1Cure is a comprehensive healthcare SaaS platform that combines telemedicine, AI-powered medical assistance, practice management, and advanced analytics. It works by providing healthcare providers with a unified platform to manage patients, conduct virtual consultations, and leverage AI insights for better care delivery.'
                },
                {
                  question: 'Is G1Cure HIPAA compliant?',
                  answer: 'Yes, G1Cure is fully HIPAA compliant. We implement bank-level security measures including end-to-end encryption, secure data storage, and comprehensive audit trails to ensure patient data privacy and security.'
                },
                {
                  question: 'What types of healthcare practices can use G1Cure?',
                  answer: 'G1Cure is designed for all types of healthcare practices including primary care, specialty clinics, hospitals, telemedicine providers, and healthcare organizations of any size. Our platform scales from small practices to large healthcare systems.'
                },
                {
                  question: 'How does the AI medical assistant work?',
                  answer: 'Our AI medical assistant uses advanced machine learning algorithms to analyze symptoms, provide treatment suggestions, check drug interactions, and offer evidence-based medical insights. It serves as a supportive tool for healthcare providers, enhancing their decision-making capabilities.'
                },
                {
                  question: 'Can G1Cure integrate with existing systems?',
                  answer: 'Absolutely! G1Cure offers seamless integration with popular EHR systems, practice management software, payment processors, and communication tools. We provide APIs and pre-built connectors for most major healthcare systems.'
                },
                {
                  question: 'What support options are available?',
                  answer: 'We offer 24/7 customer support through multiple channels including phone, email, live chat, and dedicated account management. Our team includes healthcare technology experts who understand your specific needs and challenges.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}
                >
                  <details className="group">
                    <summary className={`p-6 cursor-pointer flex items-center justify-between ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="text-xl font-semibold">{faq.question}</span>
                      <svg
                        className="w-6 h-6 transition-transform duration-300 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className={`px-6 pb-6 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <p className="text-lg leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Social Media & CTA Section */}
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
                    Stay Connected
                  </motion.h2>
                  <motion.p 
                    className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Follow us for the latest healthcare technology updates
                  </motion.p>
                  
                  {/* Social Media Links */}
                  <motion.div 
                    className="flex flex-wrap justify-center gap-6 pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    {socialMedia.map((social, index) => (
                      <motion.a
                        key={social.platform}
                        href={social.url}
                        whileHover={{ 
                          scale: 1.1,
                          y: -5,
                        }} 
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <social.icon className="w-8 h-8" />
                        <span className="text-sm font-medium">{social.platform}</span>
                        <span className="text-xs opacity-75">{social.followers}</span>
                      </motion.a>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div 
                    className="pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
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
                      Get Started Today
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
