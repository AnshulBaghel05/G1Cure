import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle, Zap, Brain, TrendingUp, CalendarDays, Users, Star, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  doctorId: string;
  doctorName: string;
  specialization: string;
  rating: number;
  consultationFee: number;
  location: string;
  conflicts?: string[];
  waitlistCount?: number;
  aiScore?: number;
}

interface AppointmentRequest {
  patientId: string;
  patientName: string;
  preferredDate: Date;
  preferredTime?: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  symptoms: string;
  preferredDoctor?: string;
  specialization?: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
}

interface SmartSchedulerProps {
  onSlotSelect: (slot: TimeSlot) => void;
  onWaitlistJoin: (slot: TimeSlot) => void;
  currentRequest?: AppointmentRequest;
}

export function SmartScheduler({ onSlotSelect, onWaitlistJoin, currentRequest }: SmartSchedulerProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'ai-suggestions'>('calendar');
  const [showConflicts, setShowConflicts] = useState(false);

  // Mock data - in real app, this would come from API
  const mockTimeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    const doctors = [
      { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', rating: 4.8, fee: 150, location: 'Main Clinic' },
      { id: '2', name: 'Dr. Michael Chen', specialization: 'Neurology', rating: 4.9, fee: 180, location: 'Main Clinic' },
      { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics', rating: 4.7, fee: 120, location: 'Branch Office' },
      { id: '4', name: 'Dr. David Kim', specialization: 'Orthopedics', rating: 4.6, fee: 160, location: 'Main Clinic' },
    ];

    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(selectedDate);
      currentDate.setDate(currentDate.getDate() + day);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const startTime = new Date(currentDate);
          startTime.setHours(hour, minute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + slotDuration);

          doctors.forEach((doctor, index) => {
            const isAvailable = Math.random() > 0.3; // 70% availability
            const conflicts = isAvailable ? [] : ['Previous appointment', 'Emergency case'];
            const waitlistCount = isAvailable ? 0 : Math.floor(Math.random() * 5);
            const aiScore = Math.random() * 100;

            slots.push({
              id: `${day}-${hour}-${minute}-${doctor.id}`,
              startTime,
              endTime,
              isAvailable,
              doctorId: doctor.id,
              doctorName: doctor.name,
              specialization: doctor.specialization,
              rating: doctor.rating,
              consultationFee: doctor.fee,
              location: doctor.location,
              conflicts,
              waitlistCount,
              aiScore
            });
          });
        }
      }
    }

    return slots;
  }, [selectedDate]);

  const filteredSlots = useMemo(() => {
    let filtered = mockTimeSlots;

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(slot => slot.specialization === selectedSpecialization);
    }

    if (selectedUrgency !== 'all') {
      // AI logic for urgency-based filtering
      filtered = filtered.sort((a, b) => {
        if (selectedUrgency === 'emergency') {
          return b.aiScore - a.aiScore;
        }
        return a.aiScore - b.aiScore;
      });
    }

    return filtered;
  }, [mockTimeSlots, selectedSpecialization, selectedUrgency]);

  const aiSuggestions = useMemo(() => {
    return filteredSlots
      .filter(slot => slot.isAvailable)
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5);
  }, [filteredSlots]);

  const conflictAnalysis = useMemo(() => {
    const conflicts = filteredSlots.filter(slot => !slot.isAvailable);
    const conflictTypes = conflicts.reduce((acc, slot) => {
      slot.conflicts?.forEach(conflict => {
        acc[conflict] = (acc[conflict] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConflicts: conflicts.length,
      conflictTypes,
      mostCommonConflict: Object.entries(conflictTypes).sort(([,a], [,b]) => b - a)[0]
    };
  }, [filteredSlots]);

  const renderCalendarView = () => (
    <div className="grid grid-cols-7 gap-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-medium text-gray-600 p-2">
          {day}
        </div>
      ))}
      
      {Array.from({ length: 35 }, (_, i) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - date.getDay() + i);
        const daySlots = filteredSlots.filter(slot => 
          slot.startTime.toDateString() === date.toDateString()
        );
        const availableSlots = daySlots.filter(slot => slot.isAvailable).length;
        const totalSlots = daySlots.length;
        
        return (
          <motion.div
            key={i}
            className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              date.toDateString() === selectedDate.toDateString() 
                ? 'bg-blue-100 border-blue-300' 
                : 'bg-white border-gray-200'
            }`}
            onClick={() => setSelectedDate(date)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm font-medium">{date.getDate()}</div>
            <div className="text-xs text-gray-500">
              {availableSlots}/{totalSlots} slots
            </div>
            {availableSlots > 0 && (
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredSlots
        .filter(slot => slot.startTime.toDateString() === selectedDate.toDateString())
        .map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-200 hover:shadow-lg ${
              slot.isAvailable ? 'border-green-200' : 'border-red-200'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      slot.isAvailable ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {slot.isAvailable ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{slot.doctorName}</h3>
                        <Badge variant="outline">{slot.specialization}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{slot.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {slot.startTime.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {slot.endTime.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{slot.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>₹{slot.consultationFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {slot.isAvailable ? (
                      <Button 
                        onClick={() => onSlotSelect(slot)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Book Now
                      </Button>
                    ) : (
                      <div className="text-right">
                        <div className="text-sm text-red-600 mb-1">
                          {slot.conflicts?.join(', ')}
                        </div>
                        {slot.waitlistCount && slot.waitlistCount > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onWaitlistJoin(slot)}
                          >
                            Join Waitlist ({slot.waitlistCount})
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {slot.aiScore && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Brain className="w-3 h-3" />
                    <span>AI Score: {slot.aiScore.toFixed(1)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
    </div>
  );

  const renderAISuggestions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <Badge className="bg-blue-600">AI Recommended</Badge>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    Score: {suggestion.aiScore.toFixed(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{suggestion.doctorName}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {suggestion.startTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{suggestion.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{suggestion.rating} rating</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onSlotSelect(suggestion)}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  Book AI Recommendation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Smart Scheduler
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered appointment scheduling with conflict detection
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="ai-suggestions">AI Suggestions</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conflict Analysis */}
      {showConflicts && conflictAnalysis.totalConflicts > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Conflict Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {conflictAnalysis.totalConflicts}
                </div>
                <div className="text-sm text-orange-700">Total Conflicts</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">
                  {conflictAnalysis.mostCommonConflict?.[0]}
                </div>
                <div className="text-sm text-orange-700">Most Common Issue</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">
                  {conflictAnalysis.mostCommonConflict?.[1]}
                </div>
                <div className="text-sm text-orange-700">Occurrences</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderCalendarView()}
          </motion.div>
        )}
        
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderListView()}
          </motion.div>
        )}
        
        {viewMode === 'ai-suggestions' && (
          <motion.div
            key="ai-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAISuggestions()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowConflicts(!showConflicts)}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          {showConflicts ? 'Hide' : 'Show'} Conflicts
        </Button>
        
        <Button
          variant="outline"
          onClick={() => toast({
            title: "AI Optimization",
            description: "AI is analyzing your schedule for optimal slot recommendations...",
          })}
          className="flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          Optimize Schedule
        </Button>
      </div>
    </div>
  );
}
