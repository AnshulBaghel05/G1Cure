import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, BookOpen, Video, MessageSquare, Phone, 
  Brain, TrendingUp, Activity, CheckCircle, AlertCircle, 
  FileText, Play, Download, ExternalLink, Star, Clock, Mail
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  tags: string[];
  aiInsights: string[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  steps: string[];
  category: string;
}

export function DoctorHelpPage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'tutorials' | 'ai-assistant' | 'contact'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HelpCircle, color: 'text-blue-500' },
    { id: 'articles', name: 'Help Articles', icon: BookOpen, color: 'text-green-500' },
    { id: 'tutorials', name: 'Video Tutorials', icon: Video, color: 'text-purple-500' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Brain, color: 'text-orange-500' },
    { id: 'contact', name: 'Contact Support', icon: MessageSquare, color: 'text-red-500' },
  ];

  const mockArticles: HelpArticle[] = [
    {
      id: 'A001',
      title: 'Getting Started with Patient Management',
      description: 'Learn the basics of managing patients, scheduling appointments, and accessing medical records.',
      category: 'Patient Management',
      difficulty: 'beginner',
      readTime: '5 min read',
      tags: ['patients', 'appointments', 'basics'],
      aiInsights: [
        'Most viewed by new users',
        'Essential for daily operations',
        'Includes step-by-step screenshots'
      ]
    },
    {
      id: 'A002',
      title: 'Advanced Lab Report Analysis',
      description: 'Master the AI-powered lab report analysis tools and interpret complex medical data.',
      category: 'Lab Reports',
      difficulty: 'advanced',
      readTime: '12 min read',
      tags: ['lab reports', 'AI analysis', 'medical data'],
      aiInsights: [
        'Popular among specialists',
        'Includes AI interpretation examples',
        'Advanced filtering techniques'
      ]
    },
    {
      id: 'A003',
      title: 'Telemedicine Best Practices',
      description: 'Optimize your virtual consultations with professional tips and technical guidance.',
      category: 'Telemedicine',
      difficulty: 'intermediate',
      readTime: '8 min read',
      tags: ['telemedicine', 'video calls', 'best practices'],
      aiInsights: [
        'Updated for latest features',
        'Includes troubleshooting guide',
        'Professional consultation tips'
      ]
    }
  ];

  const mockTutorials: Tutorial[] = [
    {
      id: 'T001',
      title: 'Complete Patient Workflow',
      description: 'Follow a complete patient journey from registration to follow-up care.',
      duration: '15:30',
      videoUrl: '#',
      steps: [
        'Patient registration and profile creation',
        'Scheduling and appointment management',
        'Medical records and documentation',
        'Lab results and analysis',
        'Follow-up and care coordination'
      ],
      category: 'Patient Management'
    },
    {
      id: 'T002',
      title: 'AI-Powered Diagnostics',
      description: 'Learn how to use AI tools for enhanced patient diagnosis and treatment planning.',
      duration: '22:15',
      videoUrl: '#',
      steps: [
        'Accessing AI diagnostic tools',
        'Interpreting AI recommendations',
        'Integrating AI insights into practice',
        'Customizing AI preferences',
        'Best practices for AI-assisted care'
      ],
      category: 'AI Features'
    },
    {
      id: 'T003',
      title: 'Advanced Analytics Dashboard',
      description: 'Master the analytics dashboard to track performance and patient outcomes.',
      duration: '18:45',
      videoUrl: '#',
      steps: [
        'Understanding key metrics',
        'Customizing dashboard views',
        'Generating reports',
        'Data export and sharing',
        'Performance optimization tips'
      ],
      category: 'Analytics'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Help Articles</p>
                <p className="text-2xl font-bold text-blue-600">47</p>
              </div>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>Comprehensive guides and documentation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Video Tutorials</p>
                <p className="text-2xl font-bold text-purple-600">23</p>
              </div>
            </div>
            <Play className="w-8 h-8 text-purple-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>Step-by-step video guides</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>AI Assistant</p>
                <p className="text-2xl font-bold text-orange-600">24/7</p>
              </div>
            </div>
            <Brain className="w-8 h-8 text-orange-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>Intelligent help and support</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
            <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download User Manual</span>
            </button>
            <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Visit Knowledge Base</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Popular Topics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Patient Management</span>
              <span className="text-sm font-medium text-blue-600">12 articles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Lab Reports</span>
              <span className="text-sm font-medium text-green-600">8 articles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Telemedicine</span>
              <span className="text-sm font-medium text-purple-600">6 articles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>AI Features</span>
              <span className="text-sm font-medium text-orange-600">5 articles</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="space-y-6">
      <div className={`rounded-2xl border transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      } overflow-hidden`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Help Articles</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all duration-500 hover:shadow-lg ${
                  isDark 
                    ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                } cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                    {article.difficulty.charAt(0).toUpperCase() + article.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{article.readTime}</span>
                  </div>
                </div>
                
                <h4 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>{article.title}</h4>
                
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{article.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {article.category}
                  </span>
                  
                  <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTutorials = () => (
    <div className="space-y-6">
      <div className={`rounded-2xl border transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      } overflow-hidden`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Video Tutorials</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all duration-500 hover:shadow-lg ${
                  isDark 
                    ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                } cursor-pointer`}
              >
                <div className="relative mb-4">
                  <div className={`w-full h-32 rounded-lg ${
                    isDark ? 'bg-slate-600' : 'bg-slate-200'
                  } flex items-center justify-center`}>
                    <Play className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
                  }`}>
                    {tutorial.duration}
                  </div>
                </div>
                
                <h4 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>{tutorial.title}</h4>
                
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{tutorial.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tutorial.category}
                  </span>
                  
                  <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>AI-Powered Help Assistant</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Get instant help and personalized guidance</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Ask me anything about the platform..."
              className={`w-full pl-10 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg text-left ${
              isDark 
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>How to manage patients?</p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Get step-by-step guidance</p>
                </div>
              </div>
            </button>
            
            <button className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg text-left ${
              isDark 
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Video consultation setup</p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Configure telemedicine</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Contact Support Team</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Get help from our dedicated support specialists</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
            isDark 
              ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Live Chat</h4>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Instant support during business hours</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300">
              Start Chat
            </button>
          </div>
          
          <div className="text-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
            isDark 
              ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Phone Support</h4>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Call us for urgent issues</p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300">
              Call Now
            </button>
          </div>
          
          <div className="text-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
            isDark 
              ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50' 
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Email Support</h4>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Send detailed inquiries</p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300">
              Send Email
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } p-6`}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Help & Support Center
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              AI-powered assistance and comprehensive resources
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Manual</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        } p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search help articles and tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="patient-management">Patient Management</option>
            <option value="lab-reports">Lab Reports</option>
            <option value="telemedicine">Telemedicine</option>
            <option value="ai-features">AI Features</option>
          </select>
          
          <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'articles' && renderArticles()}
          {activeTab === 'tutorials' && renderTutorials()}
          {activeTab === 'ai-assistant' && renderAIAssistant()}
          {activeTab === 'contact' && renderContact()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
