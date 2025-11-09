import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedKPICard } from '../components/AnimatedKPICard';
import backend from '~backend/client';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { Button } from '@/components/ui/button';

type Period = 'day' | 'week' | 'month' | 'year';

export function AnalyticsPage() {
  const { t } = useLanguage();
  const [revenuePeriod, setRevenuePeriod] = useState<Period>('month');
  const [appointmentPeriod, setAppointmentPeriod] = useState<Period>('month');

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => backend.analytics.getDashboardStats(),
  });

  const { data: revenueTrends, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-trends', revenuePeriod],
    queryFn: () => backend.analytics.getRevenueTrends({ period: revenuePeriod }),
  });

  const { data: appointmentTrends, isLoading: appointmentLoading } = useQuery({
    queryKey: ['appointment-trends', appointmentPeriod],
    queryFn: () => backend.analytics.getAppointmentTrends({ period: appointmentPeriod }),
  });

  const { data: doctorPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ['doctor-performance'],
    queryFn: () => backend.analytics.getDoctorPerformance(),
  });

  const isLoading = statsLoading || revenueLoading || appointmentLoading || performanceLoading;

  const statCards = [
    { title: t('analytics.totalPatients'), value: dashboardStats?.totalPatients || 0, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: t('analytics.totalDoctors'), value: dashboardStats?.totalDoctors || 0, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: t('analytics.totalAppointments'), value: dashboardStats?.totalAppointments || 0, icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: t('analytics.totalRevenue'), value: dashboardStats?.totalRevenue || 0, prefix: '₹', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ];

  const renderPeriodButtons = (period: Period, setPeriod: (p: Period) => void) => (
    <div className="flex gap-2">
      {(['day', 'week', 'month', 'year'] as Period[]).map(p => (
        <Button
          key={p}
          size="sm"
          variant={period === p ? 'default' : 'outline'}
          onClick={() => setPeriod(p)}
          className="capitalize"
        >
          {p}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('analytics.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of your healthcare practice performance
        </p>
      </div>

      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <AnimatedKPICard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('analytics.revenueTrends')}</CardTitle>
            {renderPeriodButtons(revenuePeriod, setRevenuePeriod)}
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={revenueTrends?.trends || []}
              type="line"
              dataKey="revenue"
              xAxisKey="date"
              colors={{ stroke: '#10b981', fill: '#10b981' }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('analytics.appointmentTrends')}</CardTitle>
            {renderPeriodButtons(appointmentPeriod, setAppointmentPeriod)}
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={appointmentTrends?.trends || []}
              type="line"
              dataKey="count"
              xAxisKey="date"
              colors={{ stroke: '#8b5cf6', fill: '#8b5cf6' }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.doctorPerformance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {doctorPerformance?.doctors.slice(0, 5).map((doctor, index) => (
              <div 
                key={doctor.doctorId} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="font-medium">{doctor.doctorName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.totalAppointments} appts</span>
                  <span className="text-sm text-green-600">₹{doctor.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
