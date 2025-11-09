import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  Shield, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Network,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Target,
  Brain,
  Sparkles
} from 'lucide-react';
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedIcon, 
  AnimatedProgress, 
  AnimatedBadge, 
  AnimatedChart,
  AnimatedTable,
  AnimatedSkeleton
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface UserActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
}

interface ClinicData {
  id: string;
  name: string;
  location: string;
  doctors: number;
  patients: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastSync: string;
}

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [systemHealth, setSystemHealth] = useState(98.5);

  // Mock data
  const systemMetrics: SystemMetric[] = [
    { name: 'Total Users', value: '12,847', change: '+8.2%', icon: Users, color: 'blue', trend: 'up' },
    { name: 'Active Clinics', value: '156', change: '+3', icon: Building2, color: 'green', trend: 'up' },
    { name: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Server, color: 'purple', trend: 'up' },
    { name: 'Revenue', value: '$2.4M', change: '+15.3%', icon: DollarSign, color: 'emerald', trend: 'up' },
    { name: 'Data Storage', value: '847GB', change: '+12%', icon: HardDrive, color: 'orange', trend: 'up' },
    { name: 'API Calls', value: '2.1M', change: '+5.7%', icon: Cpu, color: 'indigo', trend: 'up' },
  ];

  const userActivities: UserActivity[] = [
    { id: '1', user: 'Dr. Sarah Johnson', action: 'Login', timestamp: '2 min ago', status: 'success', ip: '192.168.1.100' },
    { id: '2', user: 'Admin User', action: 'User Created', timestamp: '5 min ago', status: 'success', ip: '192.168.1.101' },
    { id: '3', user: 'System', action: 'Backup Completed', timestamp: '15 min ago', status: 'success', ip: '192.168.1.1' },
    { id: '4', user: 'Dr. Mike Chen', action: 'Failed Login', timestamp: '20 min ago', status: 'error', ip: '192.168.1.102' },
    { id: '5', user: 'Clinic Manager', action: 'Settings Updated', timestamp: '1 hour ago', status: 'warning', ip: '192.168.1.103' },
  ];

  const clinics: ClinicData[] = [
    { id: '1', name: 'Central Medical Center', location: 'New York, NY', doctors: 45, patients: 2847, status: 'active', lastSync: '2 min ago' },
    { id: '2', name: 'Westside Clinic', location: 'Los Angeles, CA', doctors: 23, patients: 1247, status: 'active', lastSync: '5 min ago' },
    { id: '3', name: 'Downtown Health', location: 'Chicago, IL', doctors: 34, patients: 2156, status: 'maintenance', lastSync: '1 hour ago' },
    { id: '4', name: 'Community Care', location: 'Houston, TX', doctors: 28, patients: 1893, status: 'active', lastSync: '3 min ago' },
    { id: '5', name: 'Regional Medical', location: 'Phoenix, AZ', doctors: 19, patients: 987, status: 'inactive', lastSync: '2 days ago' },
  ];

  const performanceData = [
    { label: 'Mon', value: 95, target: 90 },
    { label: 'Tue', value: 98, target: 90 },
    { label: 'Wed', value: 92, target: 90 },
    { label: 'Thu', value: 96, target: 90 },
    { label: 'Fri', value: 99, target: 90 },
    { label: 'Sat', value: 94, target: 90 },
    { label: 'Sun', value: 97, target: 90 },
  ];

  const securityData = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 8 },
    { label: 'Mar', value: 15 },
    { label: 'Apr', value: 6 },
    { label: 'May', value: 9 },
    { label: 'Jun', value: 4 },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <AnimatedSkeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <AnimatedSkeleton key={i} variant="card" className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating 3D Icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-20 text-blue-400/30 dark:text-blue-300/30"
      >
        <Brain className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 left-20 text-emerald-400/30 dark:text-emerald-300/30"
      >
        <Target className="w-20 h-20" />
      </motion.div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                System Administration
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Monitor system health, manage users, and oversee operations
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Clinic
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <AnimatedCard 
            className="p-8 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-2xl"
            hoverEffect="glow"
            entranceAnimation="slideUp"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">System Health</h3>
                  <p className="text-emerald-100 text-lg">All systems operating normally</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm text-emerald-100">Optimal Performance</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold mb-2 text-yellow-300">{systemHealth}%</div>
                <div className="text-emerald-100 text-lg font-semibold">Uptime</div>
                <div className="mt-3">
                  <div className="w-32 h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${systemHealth}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Enhanced System Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <AnimatedCard 
                className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                hoverEffect="lift"
                entranceAnimation="slideUp"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-${metric.color}-100 to-${metric.color}-200 dark:from-${metric.color}-900/30 dark:to-${metric.color}-800/30`}>
                    <AnimatedIcon 
                      size="xl" 
                      animation="pulse" 
                      color={`var(--color-${metric.color}-600)`}
                    >
                      <metric.icon className="w-8 h-8" />
                    </AnimatedIcon>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                    metric.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {metric.name}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3">
                    {metric.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <AnimatedIcon 
                      size="sm" 
                      animation="pulse" 
                      color={metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#EF4444' : '#6B7280'}
                    >
                      {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                       metric.trend === 'down' ? <TrendingUp className="w-4 h-4 transform rotate-180" /> : 
                       <Activity className="w-4 h-4" />}
                    </AnimatedIcon>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      vs last month
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Charts & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enhanced System Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedCard 
                className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                hoverEffect="glow"
                entranceAnimation="slideLeft"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                      System Performance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Weekly performance metrics vs targets
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    {['week', 'month', 'quarter'].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedTimeframe === timeframe
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                  <AnimatedChart
                    type="line"
                    data={performanceData}
                    width={600}
                    height={300}
                    title=""
                    className="w-full"
                  />
                </div>
              </AnimatedCard>
            </motion.div>

                         {/* Enhanced Security Incidents Chart */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.5 }}
             >
               <AnimatedCard 
                 className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                 hoverEffect="glow"
                 entranceAnimation="slideLeft"
               >
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                       Security Incidents
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-lg">
                       Monthly security events and threats
                     </p>
                     <div className="flex items-center space-x-4 mt-3">
                       <div className="flex items-center space-x-2">
                         <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                         <span className="text-sm text-gray-600 dark:text-gray-400">Security Events</span>
                       </div>
                       <div className="flex items-center space-x-2">
                         <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                         <span className="text-sm text-gray-600 dark:text-gray-400">Threats</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
                     <AlertTriangle className="w-5 h-5 text-red-600" />
                     <span className="text-sm font-semibold text-red-700 dark:text-red-300">-25% from last month</span>
                   </div>
                 </div>
                 <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6">
                   <AnimatedChart
                     type="bar"
                     data={securityData}
                     width={600}
                     height={300}
                     title=""
                     className="w-full"
                   />
                 </div>
               </AnimatedCard>
             </motion.div>
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-8">
            
                         {/* Enhanced Quick Actions */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
             >
               <AnimatedCard 
                 className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                 hoverEffect="glow"
                 entranceAnimation="slideRight"
               >
                 <div className="flex items-center space-x-3 mb-6">
                   <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                     <Zap className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                     Quick Actions
                   </h3>
                 </div>
                 <div className="space-y-4">
                   {[
                     { icon: Users, label: 'Manage Users', color: 'blue', route: '/admin/users', description: 'User management & roles' },
                     { icon: Building2, label: 'Departments', color: 'green', route: '/admin/departments', description: 'Department management' },
                     { icon: Settings, label: 'System Settings', color: 'orange', route: '/admin/settings', description: 'System configuration' },
                     { icon: BarChart3, label: 'Analytics', color: 'purple', route: '/admin/analytics', description: 'Reports & insights' },
                     { icon: DollarSign, label: 'Billing & Finance', color: 'indigo', route: '/admin/billing', description: 'Financial management' },
                     { icon: Shield, label: 'Security', color: 'gray', route: '/admin/security', description: 'Security & compliance' },
                   ].map((action, index) => (
                     <motion.button
                       key={action.label}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                       whileHover={{ scale: 1.03, x: 8, y: -2 }}
                       className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 group border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                       onClick={() => action.route && (window.location.href = action.route)}
                     >
                       <div className={`p-3 rounded-xl bg-gradient-to-br from-${action.color}-100 to-${action.color}-200 dark:from-${action.color}-900/30 dark:to-${action.color}-800/30 group-hover:from-${action.color}-200 group-hover:to-${action.color}-300 dark:group-hover:from-${action.color}-800/40 dark:group-hover:to-${action.color}-700/40 transition-all duration-300`}>
                         <action.icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                       </div>
                       <div className="flex-1 text-left">
                         <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                           {action.label}
                         </span>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                           {action.description}
                         </p>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                       </div>
                     </motion.button>
                   ))}
                 </div>
               </AnimatedCard>
             </motion.div>

                         {/* Enhanced Recent System Activity */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.5 }}
             >
               <AnimatedCard 
                 className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                 hoverEffect="glow"
                 entranceAnimation="slideRight"
               >
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-3">
                     <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                       <Activity className="w-5 h-5 text-white" />
                     </div>
                     <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                       System Activity
                     </h3>
                   </div>
                   <AnimatedButton
                     size="sm"
                     variant="outline"
                     className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                   >
                     <RefreshCw className="w-4 h-4" />
                   </AnimatedButton>
                 </div>
                 <div className="space-y-4">
                   {userActivities.map((activity, index) => (
                     <motion.div
                       key={activity.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                       whileHover={{ scale: 1.02, y: -2 }}
                       className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                     >
                       <div className="flex items-center space-x-4">
                         <div className={`w-3 h-3 rounded-full ${
                           activity.status === 'success' ? 'bg-green-500' :
                           activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                         }`} /> 
                         <div>
                           <p className="text-sm font-semibold text-gray-900 dark:text-white">
                             {activity.user}
                           </p>
                           <p className="text-xs text-gray-600 dark:text-gray-400">
                             {activity.action} • {activity.timestamp}
                           </p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                           {activity.ip}
                         </span>
                         <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                           activity.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                           activity.status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                           'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                         }`}>
                           {activity.status}
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </AnimatedCard>
             </motion.div>

                         {/* Enhanced Clinic Status */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.6 }}
             >
               <AnimatedCard 
                 className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                 hoverEffect="glow"
                 entranceAnimation="slideRight"
               >
                 <div className="flex items-center space-x-3 mb-6">
                   <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                     <Building2 className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                     Clinic Status
                   </h3>
                 </div>
                 <div className="space-y-4">
                   {clinics.slice(0, 3).map((clinic, index) => (
                     <motion.div
                       key={clinic.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                       whileHover={{ scale: 1.02, y: -2 }}
                       className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                     >
                       <div className="flex items-center justify-between mb-3">
                         <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                           {clinic.name}
                         </h4>
                         <AnimatedBadge
                           variant={
                             clinic.status === 'active' ? 'success' :
                             clinic.status === 'maintenance' ? 'warning' : 'danger'
                           }
                           size="sm"
                         >
                           {clinic.status}
                         </AnimatedBadge>
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                           <Globe className="w-3 h-3" />
                           <span>{clinic.location}</span>
                         </div>
                         <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                           <div className="flex items-center space-x-1">
                             <Users className="w-3 h-3" />
                             <span>{clinic.doctors} doctors</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Activity className="w-3 h-3" />
                             <span>{clinic.patients} patients</span>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                           <Clock className="w-3 h-3" />
                           <span>Last sync: {clinic.lastSync}</span>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </AnimatedCard>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
