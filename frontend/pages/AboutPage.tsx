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
  Activity,
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
  Hash as HashIcon,
  DollarSign,
  Euro,
  PoundSterling,
  DollarSign,
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
  Target as TargetIcon2,
  Flag as FlagIcon,
  Award as AwardIcon2,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
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
  X as XIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Divide as DivideIcon,
  Percent as PercentIcon,
  Hash as HashIcon2,
  AtSign as AtSignIcon,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { ChatBotTrigger } from '../components/ChatBot';

export function AboutPage() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const isDark = resolvedTheme === 'dark';

  const values = [
    {
      icon: Heart,
      title: 'Patient-Centric Care',
      description: 'Every decision we make is guided by what\'s best for patients',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Building trust through uncompromising security and privacy',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Brain,
      title: 'Innovation First',
      description: 'Continuously pushing the boundaries of healthcare technology',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working together with healthcare providers to improve outcomes',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  const stats = [
    { number: '5+', label: 'Years of Innovation', icon: Clock, gradient: 'from-amber-500 to-orange-500' },
    { number: '100+', label: 'Team Members', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
    { number: '50+', label: 'Countries Served', icon: Globe, gradient: 'from-purple-500 to-pink-500' },
    { number: '99.9%', label: 'Customer Satisfaction', icon: Star, gradient: 'from-rose-500 to-pink-500' }
  ];

  const teamMembers = [
    {
      name: 'Patel Darshit',
      position: 'COO (Chief Operational Officer)',
      description: 'Leading operational excellence and strategic growth initiatives',
      avatar: '👨‍💼',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Piyush Singhal',
      position: 'CTO (Chief Technical Officer)',
      description: 'Driving technological innovation and platform development',
      avatar: '👨‍💻',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Anshul Singh',
      position: 'CPO (Chief Product Officer)',
      description: 'Shaping product strategy and user experience excellence',
      avatar: '👨‍🎨',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Roshan Jain',
      position: 'CMO (Chief Management Officer)',
      description: 'Overseeing organizational management and strategic planning',
      avatar: '👨‍🏭',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Rishi Jain',
      position: 'VP of Marketing',
      description: 'Leading marketing strategies and brand development',
      avatar: '👨‍💼',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  const journey = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'G1Cure was founded with a vision to revolutionize healthcare technology',
      icon: Rocket,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description: 'Successfully launched our core telemedicine platform',
      icon: Heart,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Introduced AI-powered medical assistance features',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to serve healthcare providers in 50+ countries',
      icon: Globe,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      year: '2024',
      title: 'Enterprise Solutions',
      description: 'Launched comprehensive enterprise healthcare solutions',
      icon: Building2,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      year: '2025',
      title: 'Future Vision',
      description: 'Continuing to innovate and shape the future of healthcare',
      icon: Target,
      gradient: 'from-rose-500 to-pink-500'
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
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-10"
        >
          <Box className={`${isDark ? 'text-amber-400' : 'text-amber-300'}`} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 text-5xl opacity-10"
        >
          <Octagon className={`${isDark ? 'text-orange-400' : 'text-orange-300'}`} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-20 text-4xl opacity-10"
        >
          <Layers className={`${isDark ? 'text-red-400' : 'text-red-300'}`} />
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">About G1Cure</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                Transforming Healthcare
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Through Innovation
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
              G1Cure is a pioneering healthcare technology company dedicated to revolutionizing 
              patient care through cutting-edge AI, telemedicine, and practice management solutions.
            </motion.p>
          </div>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className={`p-8 rounded-2xl border transition-all duration-500 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-200/50'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-3xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Our Mission
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    To democratize access to high-quality healthcare by providing innovative, 
                    affordable, and user-friendly technology solutions that empower healthcare 
                    providers and improve patient outcomes worldwide.
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className={`p-8 rounded-2xl border transition-all duration-500 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-200/50'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-3xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Our Vision
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    To become the global leader in healthcare technology, creating a future where 
                    every person has access to world-class healthcare regardless of their location, 
                    economic status, or background.
                  </p>
                </div>
              </motion.div>
            </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

        {/* Journey Timeline Section - Compact Design */}
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
                Our Journey
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                From startup to global healthcare technology leader
              </p>
            </motion.div>

            {/* Compact Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journey.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className={`h-full p-6 rounded-2xl border transition-all duration-500 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                      : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                  }`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${milestone.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                        <milestone.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-2xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {milestone.year}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
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
                Meet Our Leadership Team
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                The visionaries and experts driving healthcare innovation forward
              </p>
            </motion.div>

            {/* Team Grid with Custom Alignment */}
            <div className="space-y-12">
              {/* First Row - 2 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {teamMembers.slice(0, 2).map((member, index) => (
                  <motion.div
                    key={member.name}
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
                    className="relative group"
                  >
                    <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                        : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                    }`}>
                      <div className="text-center">
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-4xl shadow-2xl`}>
                          {member.avatar}
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {member.name}
                        </h3>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-4`}>
                          <span className={`text-sm font-medium ${
                            isDark ? 'text-amber-400' : 'text-amber-600'
                          }`}>
                            {member.position}
                          </span>
                        </div>
                        
                        <p className={`text-lg leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {member.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Second Row - 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {teamMembers.slice(2, 5).map((member, index) => (
                  <motion.div
                    key={member.name}
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
                    className="relative group"
                  >
                    <div className={`h-full p-6 rounded-2xl border transition-all duration-500 ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                        : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'
                    }`}>
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-3xl shadow-2xl`}>
                          {member.avatar}
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {member.name}
                        </h3>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-3`}>
                          <span className={`text-xs font-medium ${
                            isDark ? 'text-amber-400' : 'text-amber-600'
                          }`}>
                            {member.position}
                          </span>
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {member.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
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
                Our Core Values
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
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
                  className="relative group text-center"
                >
                  <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
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
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-2xl`}
                    >
                      <value.icon className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className={`text-2xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {value.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {value.description}
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
              <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-orange-900 to-red-900" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-800/90 via-orange-900/90 to-red-900/90" />
              
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
                    Join the Healthcare Revolution
                  </motion.h2>
                  <motion.p 
                    className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    Be part of the future of healthcare technology
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
                      className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 border-0 text-lg"
                    >
                      <Rocket className="w-6 h-6 mr-3 inline" />
                      Get Started Today
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
                      Learn More
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
