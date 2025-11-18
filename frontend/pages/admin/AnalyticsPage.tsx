import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Activity, 
  Calendar, Download, Filter, Search, Eye, RotateCcw,
  ArrowUpRight, ArrowDownRight, Target, Clock, 
  CheckCircle, AlertCircle, XCircle, PieChart,
  LineChart, BarChart, FileText, Share2, Zap, Brain, Sparkles
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal, AnimatedProgress, AnimatedChart 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  target: number;
  status: 'on-track' | 'behind' | 'ahead';
}

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'clinical' | 'user';
  status: 'ready' | 'generating' | 'failed';
  createdAt: string;
  lastGenerated: string;
  size: string;
  format: 'pdf' | 'csv' | 'excel';
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const analyticsData: AnalyticsData[] = [
    {
      id: '1',
      metric: 'Total Revenue',
      value: 1250000,
      change: 12.5,
      trend: 'up',
      period: 'vs last month',
      target: 1200000,
      status: 'ahead'
    },
    {
      id: '2',
      metric: 'Active Patients',
      value: 2847,
      change: 8.2,
      trend: 'up',
      period: 'vs last month',
      target: 2800,
      status: 'on-track'
    },
    {
      id: '3',
      metric: 'Appointment Completion',
      value: 94.2,
      change: -2.1,
      trend: 'down',
      period: 'vs last month',
      target: 95,
      status: 'behind'
    },
    {
      id: '4',
      metric: 'Doctor Satisfaction',
      value: 4.6,
      change: 0.3,
      trend: 'up',
      period: 'vs last month',
      target: 4.5,
      status: 'ahead'
    }
  ];

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Financial Report',
      type: 'financial',
      status: 'ready',
      createdAt: '2024-02-01',
      lastGenerated: '2024-02-20 10:30 AM',
      size: '2.4 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'Patient Demographics Analysis',
      type: 'clinical',
      status: 'ready',
      createdAt: '2024-02-01',
      lastGenerated: '2024-02-19 03:15 PM',
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      name: 'Operational Efficiency Report',
      type: 'operational',
      status: 'generating',
      createdAt: '2024-02-01',
      lastGenerated: '2024-02-18 09:45 AM',
      size: '3.1 MB',
      format: 'csv'
    },
    {
      id: '4',
      name: 'User Activity Summary',
      type: 'user',
      status: 'ready',
      createdAt: '2024-02-01',
      lastGenerated: '2024-02-17 02:20 PM',
      size: '1.2 MB',
      format: 'pdf'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'comparisons', label: 'Comparisons', icon: BarChart }
  ];

  const subPages = [
    { id: 'patient-analysis', label: 'Patient Analysis', icon: Users, active: false },
    { id: 'performance-metrics', label: 'Performance Metrics', icon: Target, active: false },
    { id: 'reserve-analytics', label: 'Reserve Analytics', icon: BarChart3, active: false }
  ];

  const chartData = [
    { label: 'Jan', patients: 1200, revenue: 80000, appointments: 450 },
    { label: 'Feb', patients: 1350, revenue: 92000, appointments: 520 },
    { label: 'Mar', patients: 1420, revenue: 98000, appointments: 580 },
    { label: 'Apr', patients: 1580, revenue: 110000, appointments: 620 },
    { label: 'May', patients: 1720, revenue: 125000, appointments: 680 },
    { label: 'Jun', patients: 1890, revenue: 138000, appointments: 720 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'behind': return 'warning';
      case 'ahead': return 'success';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return CheckCircle;
      case 'behind': return AlertCircle;
      case 'ahead': return Target;
      default: return Clock;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'green';
      case 'operational': return 'blue';
      case 'clinical': return 'purple';
      case 'user': return 'orange';
      default: return 'gray';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return DollarSign;
      case 'operational': return Activity;
      case 'clinical': return Users;
      case 'user': return Users;
      default: return FileText;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const openReportModal = (report: Report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating 3D Icons */}
      <div className="absolute top-20 right-20 text-blue-400/30 dark:text-blue-300/30">
        <Brain className="w-16 h-16" />
      </div>

      <div className="absolute bottom-20 left-20 text-emerald-400/30 dark:text-emerald-300/30">
        <Target className="w-20 h-20" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Analytics & Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Comprehensive insights into system performance and business metrics
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh Data
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Sub-pages Navigation Tabs */}
        <div className="mb-8">
          <AnimatedCard className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20">
            <div className="flex space-x-2">
              {subPages.map((page) => (
                <button
                  key={page.id}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    page.active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8">
          <AnimatedCard 
            className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
            hoverEffect="glow"
            entranceAnimation="slideUp"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range:
                </span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((metric, index) => (
            <div
              key={metric.id}
              className="transition-all duration-300 hover:scale-105"
            >
              <AnimatedCard
                className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                hoverEffect="lift"
                entranceAnimation="slideUp"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-800/30">
                    <AnimatedIcon
                      size="xl"
                      animation="pulse"
                      color="var(--color-blue-600)"
                    >
                      {(() => {
                        const IconComponent = getStatusIcon(metric.status);
                        return <IconComponent className="w-8 h-8" />;
                      })()}
                    </AnimatedIcon>
                  </div>
                  <div className="flex items-center space-x-2">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : metric.trend === 'down' ? (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <Activity className="w-5 h-5 text-blue-600" />
                    )}
                    <span className={`text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {metric.metric}
                </h3>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    {metric.metric.includes('Revenue') ? formatCurrency(metric.value) : 
                     metric.metric.includes('Satisfaction') ? metric.value.toFixed(1) : 
                     formatNumber(metric.value)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {metric.period}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <AnimatedProgress
                    value={(metric.value / metric.target) * 100}
                    size="sm"
                    variant="gradient"
                    className="flex-1 mr-3"
                  />
                  <AnimatedBadge
                    variant={getStatusColor(metric.status) as any}
                    size="sm"
                  >
                    {metric.status.replace('-', ' ')}
                  </AnimatedBadge>
                </div>
              </AnimatedCard>
            </div>
          ))}
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="mb-8">
          <AnimatedCard 
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
            hoverEffect="glow"
            entranceAnimation="slideUp"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </AnimatedCard>
        </div>

        {/* Content Based on Active Tab */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Chart */}
                <div className="transition-all duration-300 hover:scale-105">
                  <AnimatedCard 
                    className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                    hoverEffect="glow"
                    entranceAnimation="slideLeft"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                          Revenue Trend
                        </h3>
                      </div>
                      <AnimatedBadge variant="success" size="lg">
                        +12.5%
                      </AnimatedBadge>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                      <AnimatedChart
                        type="line"
                        data={chartData.map(d => ({ label: d.label, value: d.revenue }))}
                        height={300}
                        className="w-full"
                      />
                    </div>
                  </AnimatedCard>
                </div>

                {/* Patient Growth Chart */}
                <div className="transition-all duration-300 hover:scale-105">
                  <AnimatedCard 
                    className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                    hoverEffect="glow"
                    entranceAnimation="slideRight"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-800/30">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                          Patient Growth
                        </h3>
                      </div>
                      <AnimatedBadge variant="success" size="lg">
                        +8.2%
                      </AnimatedBadge>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                      <AnimatedChart
                        type="bar"
                        data={chartData.map(d => ({ label: d.label, value: d.patients }))}
                        height={300}
                        className="w-full"
                      />
                    </div>
                  </AnimatedCard>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="transition-all duration-300 hover:scale-105">
                <AnimatedCard 
                  className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                  hoverEffect="glow"
                  entranceAnimation="slideUp"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      Performance Metrics
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Patient Retention
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">87.3%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +2.1% vs last month
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Appointment Success
                      </h4>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        -2.1% vs last month
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Target className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Goal Achievement
                      </h4>
                      <p className="text-2xl font-bold text-purple-600">89.7%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +1.8% vs last month
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={report.id}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <AnimatedCard 
                    className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                    hoverEffect="glow"
                    entranceAnimation="slideLeft"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-${getReportTypeColor(report.type)}-100 dark:bg-${getReportTypeColor(report.type)}-900/20 flex items-center justify-center`}>
                          <AnimatedIcon
                            size="lg"
                            animation="pulse"
                            color={`var(--color-${getReportTypeColor(report.type)}-600)`}
                          >
                            {(() => {
                              const IconComponent = getReportTypeIcon(report.type);
                              return <IconComponent className="w-6 h-6" />;
                            })()}
                          </AnimatedIcon>
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {report.name}
                            </h3>
                            <AnimatedBadge
                              variant={report.status === 'ready' ? 'success' : 
                                     report.status === 'generating' ? 'warning' : 'danger'}
                              size="sm"
                            >
                              {report.status}
                            </AnimatedBadge>
                            <AnimatedBadge
                              variant="outline"
                              size="sm"
                              className={`border-${getReportTypeColor(report.type)}-600 text-${getReportTypeColor(report.type)}-600`}
                            >
                              {report.type}
                            </AnimatedBadge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Created: {report.createdAt}</span>
                            <span>Size: {report.size}</span>
                            <span>Format: {report.format.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AnimatedButton
                          size="sm"
                          variant="outline"
                          className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                          onClick={() => openReportModal(report)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </AnimatedButton>
                        <AnimatedButton
                          size="sm"
                          variant="outline"
                          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </AnimatedButton>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Trend Analysis Header */}
              <AnimatedCard className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                        Trend Analysis & Forecasting
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-powered insights into historical patterns and future predictions
                      </p>
                    </div>
                  </div>
                  <AnimatedButton variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Analysis
                  </AnimatedButton>
                </div>
              </AnimatedCard>

              {/* Revenue Trend */}
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h4>
                  </div>
                  <AnimatedBadge variant="outline" className="border-green-600 text-green-600">
                    +{((chartData[chartData.length - 1].revenue - chartData[0].revenue) / chartData[0].revenue * 100).toFixed(1)}% Growth
                  </AnimatedBadge>
                </div>
                <div className="space-y-4">
                  <div className="h-64">
                    <AnimatedChart
                      data={chartData}
                      type="line"
                      xKey="label"
                      yKeys={['revenue']}
                      colors={['#10b981']}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Month</p>
                      <p className="text-2xl font-bold text-green-600">${(chartData[chartData.length - 1].revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Forecast Next Month</p>
                      <p className="text-2xl font-bold text-blue-600">${((chartData[chartData.length - 1].revenue * 1.12) / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-blue-600">+12% projected</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Growth</p>
                      <p className="text-2xl font-bold text-purple-600">11.5%</p>
                      <p className="text-xs text-purple-600">per month</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Patient Growth Trend */}
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Growth Trend</h4>
                  </div>
                  <AnimatedBadge variant="outline" className="border-blue-600 text-blue-600">
                    {((chartData[chartData.length - 1].patients - chartData[0].patients) / chartData[0].patients * 100).toFixed(1)}% Increase
                  </AnimatedBadge>
                </div>
                <div className="space-y-4">
                  <div className="h-64">
                    <AnimatedChart
                      data={chartData}
                      type="area"
                      xKey="label"
                      yKeys={['patients']}
                      colors={['#3b82f6']}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
                          <p className="text-2xl font-bold text-blue-600">94.2%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">New Patients/Month</p>
                          <p className="text-2xl font-bold text-green-600">+{Math.round((chartData[chartData.length - 1].patients - chartData[chartData.length - 2].patients))}</p>
                        </div>
                        <ArrowUpRight className="w-8 h-8 text-green-600 opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Appointment Completion Trend */}
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Efficiency</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">AI Insights</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64">
                    <AnimatedChart
                      data={chartData}
                      type="bar"
                      xKey="label"
                      yKeys={['appointments']}
                      colors={['#a855f7']}
                    />
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">AI Recommendation</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Based on current trends, consider adding 2 more time slots on weekdays to accommodate growing demand.
                          Peak hours: 10 AM - 12 PM and 3 PM - 5 PM show highest booking rates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Seasonal Patterns */}
              <AnimatedCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Seasonal Patterns</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Peak Season</p>
                    <p className="text-lg font-bold text-orange-600">Spring (Mar-May)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+15% increase in appointments</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Low Season</p>
                    <p className="text-lg font-bold text-blue-600">Winter (Dec-Feb)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">-8% decrease in appointments</p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          )}

          {activeTab === 'comparisons' && (
            <div className="space-y-6">
              {/* Comparative Analysis Header */}
              <AnimatedCard className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/30 dark:to-purple-800/30">
                      <BarChart className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                        Comparative Analysis & Benchmarking
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Compare performance across departments, time periods, and industry standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                      <option>YTD</option>
                    </select>
                    <AnimatedButton variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Report
                    </AnimatedButton>
                  </div>
                </div>
              </AnimatedCard>

              {/* Month-over-Month Comparison */}
              <AnimatedCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Month-over-Month Comparison</h4>
                </div>
                <div className="space-y-4">
                  <div className="h-64">
                    <AnimatedChart
                      data={chartData}
                      type="bar"
                      xKey="label"
                      yKeys={['patients', 'appointments']}
                      colors={['#3b82f6', '#a855f7']}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {analyticsData.slice(0, 3).map((metric) => (
                      <div key={metric.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.metric}</p>
                        <div className="flex items-end justify-between mt-2">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {metric.metric.includes('Revenue') ? '$' : ''}{metric.value.toLocaleString()}
                            {metric.metric.includes('Satisfaction') || metric.metric.includes('Completion') ? '/5' : ''}
                          </p>
                          <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{Math.abs(metric.change)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Department Performance Comparison */}
              <AnimatedCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { dept: 'Cardiology', revenue: 285000, patients: 450, rating: 4.8, growth: 12 },
                    { dept: 'Pediatrics', revenue: 210000, patients: 680, rating: 4.6, growth: 8 },
                    { dept: 'Orthopedics', revenue: 195000, patients: 320, rating: 4.7, growth: 15 },
                    { dept: 'General Medicine', revenue: 340000, patients: 890, rating: 4.5, growth: 6 }
                  ].map((dept, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{dept.dept}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">${(dept.revenue / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{dept.patients}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Activity className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{dept.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AnimatedProgress value={dept.growth * 5} className="w-20" />
                          <span className={`text-sm font-semibold ${dept.growth > 10 ? 'text-green-600' : 'text-blue-600'}`}>
                            +{dept.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Industry Benchmarking */}
              <AnimatedCard className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Industry Benchmarking</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { metric: 'Patient Satisfaction', yours: 94, industry: 87, status: 'ahead' },
                    { metric: 'Appointment Completion Rate', yours: 92, industry: 85, status: 'ahead' },
                    { metric: 'Average Wait Time', yours: 18, industry: 25, status: 'ahead', unit: 'min', reverse: true },
                    { metric: 'Revenue per Patient', yours: 245, industry: 220, status: 'ahead', unit: '$' }
                  ].map((bench, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">{bench.metric}</p>
                        <AnimatedBadge
                          variant="outline"
                          className={bench.status === 'ahead' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'}
                        >
                          {bench.status === 'ahead' ? '✓ Above Industry' : '⚠ Below Industry'}
                        </AnimatedBadge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Performance</p>
                          <AnimatedProgress
                            value={bench.reverse ? 100 - (bench.yours / 30 * 100) : (bench.yours / 100 * 100)}
                            className="h-2"
                          />
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {bench.unit === '$' && '$'}{bench.yours}{bench.unit && bench.unit !== '$' ? bench.unit : ''}{!bench.unit ? '%' : ''}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Industry Average</p>
                          <AnimatedProgress
                            value={bench.reverse ? 100 - (bench.industry / 30 * 100) : (bench.industry / 100 * 100)}
                            className="h-2 opacity-50"
                          />
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
                            {bench.unit === '$' && '$'}{bench.industry}{bench.unit && bench.unit !== '$' ? bench.unit : ''}{!bench.unit ? '%' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Competitive Insights */}
              <AnimatedCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Competitive Advantage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Your healthcare facility is performing exceptionally well compared to industry standards:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        <span>7% higher patient satisfaction than average</span>
                      </li>
                      <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        <span>28% lower average wait time</span>
                      </li>
                      <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        <span>11% higher revenue per patient</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        <AnimatedModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={`Report Details - ${selectedReport?.name}`}
          size="lg"
        >
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full bg-${getReportTypeColor(selectedReport.type)}-100 dark:bg-${getReportTypeColor(selectedReport.type)}-900/20 flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = getReportTypeIcon(selectedReport.type);
                        return <IconComponent className={`w-4 h-4 text-${getReportTypeColor(selectedReport.type)}-600`} />;
                      })()}
                    </div>
                    <AnimatedBadge
                      variant="outline"
                      size="lg"
                      className={`border-${getReportTypeColor(selectedReport.type)}-600 text-${getReportTypeColor(selectedReport.type)}-600`}
                    >
                      {selectedReport.type}
                    </AnimatedBadge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <AnimatedBadge
                    variant={selectedReport.status === 'ready' ? 'success' : 
                           selectedReport.status === 'generating' ? 'warning' : 'danger'}
                    size="lg"
                  >
                    {selectedReport.status}
                  </AnimatedBadge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.createdAt}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Generated
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.lastGenerated}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File Size
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.size}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Format
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReport.format.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Close
                </AnimatedButton>
                <AnimatedButton
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </AnimatedButton>
              </div>
            </div>
          )}
        </AnimatedModal>
      </div>
    </div>
  );
}
