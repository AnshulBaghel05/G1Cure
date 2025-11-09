import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Brain,
  Sparkles
} from 'lucide-react';
import { AnimatedCard, AnimatedButton, AnimatedInput } from '../../components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <div className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Help & Support Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers, learn best practices, and get support for all admin portal features
        </p>
      </div>
    </div>
  );
}
