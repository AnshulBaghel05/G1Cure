import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Activity, Filter, TrendingUp, AlertTriangle, CheckCircle, Pill, Stethoscope, FileText, Heart, Brain, Eye, Tooth } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MedicalEvent {
  id: string;
  eventType: 'appointment' | 'diagnosis' | 'medication' | 'lab_test' | 'procedure' | 'allergy' | 'vaccination' | 'surgery' | 'emergency' | 'follow_up';
  title: string;
  description: string;
  eventDate: Date;
  doctorName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
}

interface PatientTimelineProps {
  patientId: string;
  events: MedicalEvent[];
  onEventClick?: (event: MedicalEvent) => void;
}

const eventTypeIcons = {
  appointment: Calendar,
  diagnosis: Stethoscope,
  medication: Pill,
  lab_test: FileText,
  procedure: Activity,
  allergy: AlertTriangle,
  vaccination: CheckCircle,
  surgery: Activity,
  emergency: AlertTriangle,
  follow_up: Clock
};

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const severityChartColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444'
};

export function PatientTimeline({ patientId, events, onEventClick }: PatientTimelineProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'chart' | 'analytics'>('timeline');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('1y');

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(event => event.eventType === selectedFilter);
    }
    
    // Filter by time range
    const now = new Date();
    const timeRanges = {
      '1m': new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
      '3m': new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      '6m': new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
      '1y': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      'all': new Date(0)
    };
    
    filtered = filtered.filter(event => event.eventDate >= timeRanges[timeRange]);
    
    return filtered.sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
  }, [events, selectedFilter, timeRange]);

  const analyticsData = useMemo(() => {
    const eventTypeCounts = filteredEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityCounts = filteredEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = filteredEvents.reduce((acc, event) => {
      const month = event.eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      eventTypeCounts: Object.entries(eventTypeCounts).map(([type, count]) => ({ type, count })),
      severityCounts: Object.entries(severityCounts).map(([severity, count]) => ({ severity, count })),
      monthlyData: Object.entries(monthlyData).map(([month, count]) => ({ month, count })).sort((a, b) => 
        new Date(a.month).getTime() - new Date(b.month).getTime()
      )
    };
  }, [filteredEvents]);

  const renderTimelineView = () => (
    <div className="space-y-6">
      {filteredEvents.map((event, index) => {
        const Icon = eventTypeIcons[event.eventType];
        return (
          <div
            key={event.id}
            className="relative transition-opacity duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${severityColors[event.severity]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {index < filteredEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                )}
              </div>
              
              <Card 
                className={`flex-1 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  event.severity === 'critical' ? 'border-red-200 bg-red-50/50' : ''
                }`}
                onClick={() => onEventClick?.(event)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {event.title}
                        <Badge variant="outline" className={severityColors[event.severity]}>
                          {event.severity}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.eventDate.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {event.eventType.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{event.description}</p>
                  {event.doctorName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Dr. {event.doctorName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderChartView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Events Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Event Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.eventTypeCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.eventTypeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Severity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.severityCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6">
                {analyticsData.severityCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={severityChartColors[entry.severity as keyof typeof severityChartColors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Timeline</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredEvents.length} events in the selected time range
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="chart">Charts</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
              <SelectItem value="diagnosis">Diagnoses</SelectItem>
              <SelectItem value="medication">Medications</SelectItem>
              <SelectItem value="lab_test">Lab Tests</SelectItem>
              <SelectItem value="procedure">Procedures</SelectItem>
              <SelectItem value="allergy">Allergies</SelectItem>
              <SelectItem value="vaccination">Vaccinations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1M</SelectItem>
              <SelectItem value="3m">3M</SelectItem>
              <SelectItem value="6m">6M</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="transition-opacity duration-300">
        {viewMode === 'timeline' && (
          <div className="animate-fadeIn">
            {renderTimelineView()}
          </div>
        )}

        {viewMode === 'chart' && (
          <div className="animate-fadeIn">
            {renderChartView()}
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{filteredEvents.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critical Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {filteredEvents.filter(e => e.severity === 'critical').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {filteredEvents.filter(e => e.isActive && e.severity === 'high').length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
