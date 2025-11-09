import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Video, 
  CreditCard, 
  BarChart3,
  Activity,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('home.features.emr'),
      description: 'Complete patient management with digital records',
      link: '/patients',
    },
    {
      icon: Video,
      title: t('home.features.telemedicine'),
      description: 'Secure video consultations with patients',
      link: '/telemedicine',
    },
    {
      icon: CreditCard,
      title: t('home.features.billing'),
      description: 'Automated billing and payment processing',
      link: '/billing',
    },
    {
      icon: BarChart3,
      title: t('home.features.analytics'),
      description: 'Advanced analytics and reporting',
      link: '/analytics',
    },
  ];

  const stats = [
    { icon: Activity, label: 'Active Clinics', value: '500+' },
    { icon: Users, label: 'Patients Served', value: '50K+' },
    { icon: Shield, label: 'Data Security', value: '99.9%' },
    { icon: Zap, label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/patients">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
            <Link to="/analytics">View Demo</Link>
          </Button>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="text-center space-y-2"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to run a modern healthcare practice efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={feature.link}>Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
      >
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of healthcare providers who trust G1Cure for their practice management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link to="/patients">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/analytics">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
