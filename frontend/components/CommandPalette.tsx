import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  UserCheck,
  Calendar,
  Video,
  CreditCard,
  BarChart3,
  Plus,
  Settings,
  LogOut,
  Command,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'actions' | 'recent' | 'settings';
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Define all available commands
  const commands: CommandAction[] = useMemo(() => {
    const baseCommands: CommandAction[] = [
      // Navigation
      {
        id: 'nav-dashboard',
        title: 'Dashboard',
        subtitle: 'Go to dashboard',
        icon: BarChart3,
        action: () => { navigate('/dashboard'); onClose(); },
        keywords: ['dashboard', 'home', 'overview'],
        category: 'navigation',
        shortcut: 'Ctrl+D'
      },
      {
        id: 'nav-patients',
        title: 'Patients',
        subtitle: 'Manage patient records',
        icon: Users,
        action: () => { navigate('/patients'); onClose(); },
        keywords: ['patients', 'records', 'medical'],
        category: 'navigation',
        shortcut: 'Ctrl+P'
      },
      {
        id: 'nav-appointments',
        title: 'Appointments',
        subtitle: 'View and manage appointments',
        icon: Calendar,
        action: () => { navigate('/appointments'); onClose(); },
        keywords: ['appointments', 'schedule', 'calendar'],
        category: 'navigation',
        shortcut: 'Ctrl+A'
      },
      {
        id: 'nav-telemedicine',
        title: 'Telemedicine',
        subtitle: 'Video consultations',
        icon: Video,
        action: () => { navigate('/telemedicine'); onClose(); },
        keywords: ['telemedicine', 'video', 'consultation'],
        category: 'navigation',
        shortcut: 'Ctrl+T'
      },
      {
        id: 'nav-billing',
        title: 'Billing',
        subtitle: 'Manage invoices and payments',
        icon: CreditCard,
        action: () => { navigate('/billing'); onClose(); },
        keywords: ['billing', 'invoices', 'payments'],
        category: 'navigation',
        shortcut: 'Ctrl+B'
      },
      
      // Actions
      {
        id: 'action-add-patient',
        title: 'Add New Patient',
        subtitle: 'Create a new patient record',
        icon: Plus,
        action: () => { navigate('/patients'); onClose(); },
        keywords: ['add', 'new', 'patient', 'create'],
        category: 'actions'
      },
      {
        id: 'action-schedule-appointment',
        title: 'Schedule Appointment',
        subtitle: 'Book a new appointment',
        icon: Calendar,
        action: () => { navigate('/appointments'); onClose(); },
        keywords: ['schedule', 'book', 'appointment', 'new'],
        category: 'actions'
      },
      {
        id: 'action-create-bill',
        title: 'Create Bill',
        subtitle: 'Generate a new invoice',
        icon: CreditCard,
        action: () => { navigate('/billing'); onClose(); },
        keywords: ['create', 'bill', 'invoice', 'new'],
        category: 'actions'
      },
      
      // Settings
      {
        id: 'settings-profile',
        title: 'Profile Settings',
        subtitle: 'Manage your profile',
        icon: Settings,
        action: () => { navigate('/settings'); onClose(); },
        keywords: ['settings', 'profile', 'account'],
        category: 'settings'
      },
      {
        id: 'action-logout',
        title: 'Logout',
        subtitle: 'Sign out of your account',
        icon: LogOut,
        action: () => { logout(); onClose(); },
        keywords: ['logout', 'sign out', 'exit'],
        category: 'settings'
      },
    ];

    // Add role-specific commands
    if (user?.role === 'admin') {
      baseCommands.push(
        {
          id: 'nav-doctors',
          title: 'Doctors',
          subtitle: 'Manage doctor profiles',
          icon: UserCheck,
          action: () => { navigate('/admin/doctors'); onClose(); },
          keywords: ['doctors', 'staff', 'manage'],
          category: 'navigation'
        },
        {
          id: 'nav-analytics',
          title: 'Analytics',
          subtitle: 'View detailed analytics',
          icon: BarChart3,
          action: () => { navigate('/admin/analytics'); onClose(); },
          keywords: ['analytics', 'reports', 'statistics'],
          category: 'navigation'
        }
      );
    }

    return baseCommands;
  }, [user, navigate, onClose, logout]);

  // Fuzzy search implementation
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    return commands
      .map(command => {
        const searchText = [
          command.title,
          command.subtitle || '',
          ...command.keywords
        ].join(' ').toLowerCase();

        let score = 0;
        let matchedTerms = 0;

        searchTerms.forEach(term => {
          if (searchText.includes(term)) {
            matchedTerms++;
            // Boost score for title matches
            if (command.title.toLowerCase().includes(term)) {
              score += 10;
            }
            // Boost score for exact matches
            if (command.title.toLowerCase() === term) {
              score += 20;
            }
            score += 1;
          }
        });

        // Only include commands that match all search terms
        if (matchedTerms === searchTerms.length) {
          return { ...command, score };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.score || 0) - (a?.score || 0)) as CommandAction[];
  }, [query, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset query when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    recent: 'Recent',
    settings: 'Settings'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-200" />

      {/* Command palette */}
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for commands, pages, or actions..."
              className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0"
              autoFocus
            />
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm">Try searching for "patients", "appointments", or "billing"</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </div>
                    <div className="space-y-1">
                      {commands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <div
                            key={command.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                            onClick={command.action}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <command.icon className={`w-4 h-4 ${
                                isSelected ? 'text-blue-600' : 'text-gray-600'
                              }`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">{command.title}</div>
                              {command.subtitle && (
                                <div className="text-sm text-gray-500 truncate">{command.subtitle}</div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {command.shortcut && (
                                <Badge variant="secondary" className="text-xs">
                                  {command.shortcut}
                                </Badge>
                              )}
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">Up/Down</kbd>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">Enter</kbd>
                <span>select</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
