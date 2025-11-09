import React, { useState } from 'react';
import {
  HelpCircle, Search, MessageSquare, Phone, Mail,
  BookOpen, Video, FileText, Download, Star,
  ChevronDown, ChevronRight, ExternalLink,
  CheckCircle, AlertCircle, Info, Clock
} from 'lucide-react';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'appointments' | 'billing' | 'technical' | 'privacy';
  isExpanded: boolean;
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  tags: string[];
}

interface ContactMethod {
  id: string;
  type: 'chat' | 'phone' | 'email' | 'ticket';
  title: string;
  description: string;
  icon: any;
  action: string;
  availability: string;
}

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'To book an appointment, navigate to the Appointments page and click the "Book Appointment" button. You can then select your preferred doctor, date, and time slot. The system will confirm your appointment and send you a confirmation email.',
      category: 'appointments',
      isExpanded: false
    },
    {
      id: '2',
      question: 'How can I view my medical records?',
      answer: 'Your medical records are available on the Medical Records page. You can view test results, prescriptions, and treatment history. Some records may require doctor approval before they become visible.',
      category: 'general',
      isExpanded: false
    },
    {
      id: '3',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. You can also set up automatic payments for recurring charges.',
      category: 'billing',
      isExpanded: false
    },
    {
      id: '4',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email to create a new password.',
      category: 'technical',
      isExpanded: false
    },
    {
      id: '5',
      question: 'Is my health information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your health information. All data is stored securely and we comply with HIPAA regulations.',
      category: 'privacy',
      isExpanded: false
    },
    {
      id: '6',
      question: 'Can I cancel or reschedule appointments?',
      answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to the Appointments page, find your appointment, and use the "Reschedule" or "Cancel" options.',
      category: 'appointments',
      isExpanded: false
    }
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with G1Cure',
      description: 'Learn the basics of using our healthcare platform, from creating your account to booking your first appointment.',
      category: 'Getting Started',
      readTime: '5 min read',
      tags: ['beginner', 'setup', 'tutorial']
    },
    {
      id: '2',
      title: 'Understanding Your Medical Records',
      description: 'A comprehensive guide to reading and interpreting your medical records, test results, and treatment plans.',
      category: 'Medical Records',
      readTime: '8 min read',
      tags: ['medical', 'records', 'health']
    },
    {
      id: '3',
      title: 'Managing Your Appointments',
      description: 'Everything you need to know about scheduling, managing, and preparing for your healthcare appointments.',
      category: 'Appointments',
      readTime: '6 min read',
      tags: ['appointments', 'scheduling', 'preparation']
    },
    {
      id: '4',
      title: 'Billing and Insurance Guide',
      description: 'Navigate the complexities of medical billing, insurance claims, and payment options.',
      category: 'Billing',
      readTime: '10 min read',
      tags: ['billing', 'insurance', 'payments']
    }
  ];

  const contactMethods: ContactMethod[] = [
    {
      id: '1',
      type: 'chat',
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: MessageSquare,
      action: 'Start Chat',
      availability: '24/7 Available'
    },
    {
      id: '2',
      type: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with a support representative',
      icon: Phone,
      action: 'Call Now',
      availability: 'Mon-Fri 8AM-8PM EST'
    },
    {
      id: '3',
      type: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      availability: 'Response within 24 hours'
    },
    {
      id: '4',
      type: 'ticket',
      title: 'Support Ticket',
      description: 'Create a support ticket for complex issues',
      icon: FileText,
      action: 'Create Ticket',
      availability: 'Response within 48 hours'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: faqs.length },
    { id: 'general', name: 'General', count: faqs.filter(f => f.category === 'general').length },
    { id: 'appointments', name: 'Appointments', count: faqs.filter(f => f.category === 'appointments').length },
    { id: 'billing', name: 'Billing', count: faqs.filter(f => f.category === 'billing').length },
    { id: 'technical', name: 'Technical', count: faqs.filter(f => f.category === 'technical').length },
    { id: 'privacy', name: 'Privacy & Security', count: faqs.filter(f => f.category === 'privacy').length }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setSelectedFAQ(faqs.find(f => f.id === id) || null);
    setIsModalOpen(true);
  };

  const handleStartChat = () => {
    setIsChatModalOpen(true);
  };

  const handleSendEmail = () => {
    window.location.href = 'mailto:darshitp091@gmail.com?subject=G1Cure Support Request';
  };

  const handleCreateTicket = () => {
    setIsTicketModalOpen(true);
  };

  const handleSubmitTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // In a real app, this would send to backend
      console.log('Creating support ticket:', ticketData);
      alert('Support ticket created successfully! We will get back to you within 48 hours.');
      setIsTicketModalOpen(false);
      setTicketData({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general'
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appointments': return 'from-blue-500 to-indigo-500';
      case 'billing': return 'from-purple-500 to-pink-500';
      case 'technical': return 'from-orange-500 to-red-500';
      case 'privacy': return 'from-emerald-500 to-teal-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Enhanced Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mt-3">
                Find answers to your questions and get the support you need
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <div
              key={method.id}
              className="relative group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {method.description}
                </p>
                <button
                  onClick={() => {
                    switch (method.type) {
                      case 'chat':
                        handleStartChat();
                        break;
                      case 'phone':
                        alert('Phone support is not available yet. Please use other contact methods.');
                        break;
                      case 'email':
                        handleSendEmail();
                        break;
                      case 'ticket':
                        handleCreateTicket();
                        break;
                      default:
                        break;
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl w-full rounded-xl font-medium transition-all duration-300"
                >
                  {method.action}
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {method.availability}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Help Articles */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Help Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="relative group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300" />
                  <div className="relative p-6 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{article.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700/30 dark:to-slate-800/30 text-slate-600 dark:text-slate-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          switch (article.id) {
                            case '1':
                              window.location.href = '/patient/help/getting-started';
                              break;
                            case '2':
                              window.location.href = '/patient/help/medical-records';
                              break;
                            case '3':
                              window.location.href = '/patient/help/appointments';
                              break;
                            case '4':
                              window.location.href = '/patient/help/billing';
                              break;
                            default:
                              break;
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300 flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-6 rounded-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for help articles and FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
          <div className="relative p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="relative group hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300" />
                  <div className="relative p-6 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(faq.category)} flex items-center justify-center`}>
                            <HelpCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(faq.category)} text-white rounded-full text-xs font-medium`}>
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl ml-4 rounded-xl font-medium transition-all duration-300 flex items-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Detail Modal */}
      {isModalOpen && selectedFAQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">FAQ Details</h2>
            </div>
            <div className="p-6">
        {selectedFAQ && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(selectedFAQ.category)} flex items-center justify-center`}>
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedFAQ.question}
                </h3>
                <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(selectedFAQ.category)} text-white rounded-full text-sm font-medium`}>
                  {selectedFAQ.category.charAt(0).toUpperCase() + selectedFAQ.category.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Answer</h4>
              <p className="text-slate-700 dark:text-slate-300">{selectedFAQ.answer}</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300"
              >
                Close
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Chat Support</h2>
            </div>
            <div className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Connect with Support
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our support team is available 24/7 to help you with any questions or issues.
            </p>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Support Agent Online</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hi! I'm here to help you. How can I assist you today?
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Average response time: 2 minutes</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsChatModalOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Support Ticket</h2>
            </div>
            <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Subject *
              </label>
              <input
                type="text"
                value={ticketData.subject}
                onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                value={ticketData.priority}
                onChange={(e) => setTicketData({...ticketData, priority: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={ticketData.category}
                onChange={(e) => setTicketData({...ticketData, category: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="appointments">Appointments</option>
                <option value="medical">Medical Records</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description *
            </label>
            <textarea
              value={ticketData.description}
              onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
              placeholder="Please provide detailed information about your issue..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitTicket}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Ticket
            </button>
          </div>
        </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
