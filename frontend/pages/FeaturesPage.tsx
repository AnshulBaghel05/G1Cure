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
  Video,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Bell,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Camera,
  Mic,
  Headphones,
  WifiOff,
  Battery,
  Signal,
  WifiIcon,
  Bluetooth,
  QrCode,
  Barcode,
  Cpu,
  HardDrive,
  MemoryStick,
  Usb,
  Monitor,
  Power,
  Volume2,
  VolumeX,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Edit,
  Trash2,
  Copy,
  Scissors,
  Save,
  Download,
  Upload,
  Share,
  Link,
  ExternalLink,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Navigation,
  Compass,
  Globe as GlobeIcon,
  Wifi as WifiIcon2,
  Signal as SignalIcon,
  Battery as BatteryIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  User,
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
  QrCode as QrCodeIcon,
  Barcode as BarcodeIcon,
  CreditCard as CreditCardIcon,
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
  Hash as HashIcon,
  DollarSign as DollarSignIcon,
  Euro as EuroIcon,
  PoundSterling as PoundSterlingIcon,
  DollarSign as DollarIcon,
  Bitcoin as BitcoinIcon,
  CreditCard as CreditCardIcon2,
  Wallet as WalletIcon,
  Banknote,
  Coins,
  PiggyBank,
  Shield,
  Vault,
  Lock as LockIcon2,
  Unlock as UnlockIcon2,
  Key as KeyIcon,
  Eye as EyeIcon2,
  EyeOff as EyeOffIcon,
  Fingerprint as FingerprintIcon2,
  Scan as ScanIcon,
  QrCode as QrCodeIcon2,
  Barcode as BarcodeIcon2,
  Lock as LockIcon3,
  Unlock as UnlockIcon3,
  Key as KeyIcon2,
  Eye as EyeIcon3,
  EyeOff as EyeOffIcon2,
  Fingerprint as FingerprintIcon3,
  Scan as ScanIcon2,
  QrCode as QrCodeIcon3,
  Barcode as BarcodeIcon3,
  CreditCard as CreditCardIcon3,
  Wallet as WalletIcon2,
  DollarSign as DollarSignIcon2,
  Euro as EuroIcon2,
  PoundSterling as PoundSterlingIcon2,
  DollarSign as DollarIcon2,
  Bitcoin as BitcoinIcon2,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon,
  BarChart3 as BarChart3Icon2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  ScatterChart as ScatterChartIcon,
  Radar as RadarIcon,
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

export function FeaturesPage() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const isDark = resolvedTheme === 'dark';

  const coreFeatures = [
    {
      icon: Video,
      title: 'Advanced Telemedicine',
      description: 'High-definition video consultations with AI-powered diagnostics',
      features: ['HD Video Calls', 'AI Symptom Analysis', 'Screen Sharing', 'Recording & Playback'],
      gradient: 'from-blue-500 to-indigo-500',
      category: 'Care Delivery'
    },
    {
      icon: Brain,
      title: 'AI Medical Assistant',
      description: 'Intelligent healthcare insights and treatment recommendations',
      features: ['Symptom Analysis', 'Treatment Suggestions', 'Drug Interactions', 'Medical Literature'],
      gradient: 'from-purple-500 to-pink-500',
      category: 'Intelligence'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with HIPAA compliance and audit trails',
      features: ['End-to-End Encryption', 'HIPAA Compliance', 'Audit Logs', 'Access Controls'],
      gradient: 'from-emerald-500 to-teal-500',
      category: 'Security'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive business intelligence and performance metrics',
      features: ['Real-time Dashboards', 'Predictive Analytics', 'Financial Reports', 'Patient Outcomes'],
      gradient: 'from-orange-500 to-red-500',
      category: 'Analytics'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination across departments and locations',
      features: ['Role-based Access', 'Real-time Updates', 'Communication Tools', 'Workflow Management'],
      gradient: 'from-cyan-500 to-blue-500',
      category: 'Workflow'
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Scalable, secure, and globally distributed platform',
      features: ['Auto-scaling', 'Global CDN', '99.9% Uptime', 'Data Backup'],
      gradient: 'from-violet-500 to-purple-500',
      category: 'Infrastructure'
    }
  ];

  const technologyStack = [
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Advanced algorithms for healthcare insights',
      technologies: ['TensorFlow', 'PyTorch', 'Natural Language Processing', 'Computer Vision'],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Platform',
      description: 'Enterprise-grade cloud infrastructure',
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes'],
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security measures',
      technologies: ['SOC 2 Type II', 'HIPAA', 'GDPR', 'ISO 27001'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Robust data handling and analytics',
      technologies: ['PostgreSQL', 'Redis', 'Elasticsearch', 'Apache Kafka'],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const integrations = [
    {
      icon: Calendar,
      title: 'Practice Management',
      description: 'Seamless integration with existing systems',
      partners: ['Epic', 'Cerner', 'Athenahealth', 'Practice Fusion']
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Secure payment solutions for healthcare',
      partners: ['Stripe', 'Square', 'PayPal', 'Authorize.net']
    },
    {
      icon: FileText,
      title: 'Electronic Health Records',
      description: 'Comprehensive EHR integration',
      partners: ['Allscripts', 'eClinicalWorks', 'NextGen', 'Greenway']
    },
    {
      icon: Bell,
      title: 'Communication Tools',
      description: 'Enhanced patient communication',
      partners: ['Twilio', 'SendGrid', 'Slack', 'Microsoft Teams']
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
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Platform Features</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                Powerful Features for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                Modern Healthcare
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
              Discover the comprehensive suite of features that make G1Cure the most advanced 
              healthcare SaaS platform in the industry.
            </motion.p>
          </div>
        </motion.section>

        {/* Core Features Section */}
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
                Core Platform Features
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Everything you need to deliver exceptional healthcare services
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
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
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl`} />
                      <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl`} />
                    </div>

                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-4">
                          <span className={`text-xs font-medium ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {feature.category}
                          </span>
                        </div>
                      </div>

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

                      <h3 className={`text-2xl font-bold mb-4 text-center ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-lg leading-relaxed mb-6 text-center ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {feature.description}
                      </p>

                      <div className="space-y-3">
                        {feature.features.map((feat, featIndex) => (
                          <motion.div
                            key={feat}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + featIndex * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-sm ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {feat}
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
                Technology Stack
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Built with cutting-edge technologies for optimal performance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologyStack.map((tech, index) => (
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
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center shadow-lg`}
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
                      {tech.technologies.map((technology, techIndex) => (
                        <div key={techIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className={`text-xs ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {technology}
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

        {/* Integrations Section */}
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
                Seamless Integrations
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Connect with your existing tools and workflows
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.title}
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
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                    >
                      <integration.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 text-center ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {integration.title}
                    </h3>
                    <p className={`text-sm mb-4 text-center ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {integration.description}
                    </p>

                    <div className="space-y-2">
                      {integration.partners.map((partner, partnerIndex) => (
                        <div key={partnerIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                          <span className={`text-xs ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {partner}
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
                    Ready to Experience the Future?
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
