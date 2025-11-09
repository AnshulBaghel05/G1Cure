import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  UserCheck, 
  Calendar, 
  Video, 
  CreditCard, 
  BarChart3,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/patients', icon: Users, label: t('nav.patients') },
    { path: '/doctors', icon: UserCheck, label: t('nav.doctors') },
    { path: '/appointments', icon: Calendar, label: t('nav.appointments') },
    { path: '/telemedicine', icon: Video, label: t('nav.telemedicine') },
    { path: '/billing', icon: CreditCard, label: t('nav.billing') },
    { path: '/analytics', icon: BarChart3, label: t('nav.analytics') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G1</span>
              </div>
              <span className="font-bold text-xl text-gray-900">G1Cure</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
