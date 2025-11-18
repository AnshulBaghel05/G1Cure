import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Plus,
  Filter,
  Download,
  Search,
  Grid3x3,
  List,
  Repeat,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks, isSameDay, parseISO, startOfMonth, endOfMonth, eachWeekOfInterval, getDay } from 'date-fns';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  startTime: Date;
  endTime: Date;
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  location?: string;
  notes?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate: Date;
  };
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentDrop?: (appointmentId: string, newStartTime: Date) => void;
  onCreateAppointment?: (startTime: Date) => void;
  onReschedule?: (appointmentId: string, newStartTime: Date) => void;
}

type ViewMode = 'day' | 'week' | 'month';

const statusColors = {
  scheduled: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300',
  confirmed: 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300',
  completed: 'bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300',
  'no-show': 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-300',
};

const typeIcons = {
  consultation: '🏥',
  'follow-up': '🔄',
  emergency: '🚨',
  telemedicine: '💻',
};

export function AppointmentCalendar({
  appointments = [],
  onAppointmentClick,
  onAppointmentDrop,
  onCreateAppointment,
  onReschedule,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate time slots (6 AM to 10 PM in 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({ hour, minute, label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}` });
      }
    }
    return slots;
  }, []);

  // Get visible days based on view mode
  const visibleDays = useMemo(() => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      // Month view
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, viewMode]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Status filter
      if (filterStatus !== 'all' && apt.status !== filterStatus) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          apt.patientName.toLowerCase().includes(query) ||
          apt.doctorName.toLowerCase().includes(query) ||
          apt.location?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [appointments, filterStatus, searchQuery]);

  // Get appointments for a specific day and time slot
  const getAppointmentsForSlot = useCallback((day: Date, hour: number, minute: number) => {
    const slotStart = new Date(day);
    slotStart.setHours(hour, minute, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return filteredAppointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      return (
        isSameDay(aptStart, day) &&
        ((aptStart >= slotStart && aptStart < slotEnd) ||
         (aptStart < slotStart && aptEnd > slotStart))
      );
    });
  }, [filteredAppointments]);

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedAppointment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour: number, minute: number) => {
    e.preventDefault();
    if (draggedAppointment && onAppointmentDrop) {
      const newStartTime = new Date(day);
      newStartTime.setHours(hour, minute, 0, 0);
      onAppointmentDrop(draggedAppointment.id, newStartTime);
      setDraggedAppointment(null);
    }
  };

  const handleSlotClick = (day: Date, hour: number, minute: number) => {
    if (onCreateAppointment) {
      const startTime = new Date(day);
      startTime.setHours(hour, minute, 0, 0);
      onCreateAppointment(startTime);
    }
  };

  // Get appointment duration in slots (30 min each)
  const getAppointmentHeight = (appointment: Appointment) => {
    const duration = (new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60);
    return Math.ceil(duration / 30);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = appointments.filter(apt => isSameDay(new Date(apt.startTime), today));

    return {
      total: appointments.length,
      today: todayAppointments.length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      pending: appointments.filter(apt => apt.status === 'scheduled').length,
    };
  }, [appointments]);

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Appointment Calendar
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(currentDate, 'MMMM yyyy')}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="h-8"
                >
                  Day
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="h-8"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="h-8"
                >
                  Month
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={goToPrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Actions */}
              <Button size="sm" onClick={() => onCreateAppointment?.(new Date())}>
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats and filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            {/* Quick stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total: <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Today: <span className="font-semibold text-gray-900 dark:text-white">{stats.today}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pending: <span className="font-semibold text-gray-900 dark:text-white">{stats.pending}</span>
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar view */}
      <Card>
        <CardContent className="p-0">
          {viewMode !== 'month' ? (
            // Week/Day View
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${visibleDays.length}, minmax(150px, 1fr))` }}>
                  {/* Header row */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</span>
                  </div>
                  {visibleDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-l border-gray-200 dark:border-gray-700 p-4 text-center ${
                        isSameDay(day, new Date()) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}

                  {/* Time slots */}
                  {timeSlots.map((slot) => (
                    <React.Fragment key={`${slot.hour}-${slot.minute}`}>
                      <div className="border-b border-gray-200 dark:border-gray-700 p-2 text-right pr-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{slot.label}</span>
                      </div>
                      {visibleDays.map((day, dayIdx) => {
                        const appointmentsInSlot = getAppointmentsForSlot(day, slot.hour, slot.minute);
                        return (
                          <div
                            key={`${dayIdx}-${slot.hour}-${slot.minute}`}
                            className="relative border-b border-l border-gray-200 dark:border-gray-700 min-h-[60px] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day, slot.hour, slot.minute)}
                            onClick={() => handleSlotClick(day, slot.hour, slot.minute)}
                          >
                            {appointmentsInSlot.map((apt) => {
                              const aptStart = new Date(apt.startTime);
                              if (aptStart.getHours() === slot.hour && aptStart.getMinutes() === slot.minute) {
                                const height = getAppointmentHeight(apt);
                                return (
                                  <div
                                    key={apt.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, apt)}
                                    onDragEnd={handleDragEnd}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAppointmentClick?.(apt);
                                    }}
                                    className={`absolute inset-x-1 top-1 border-l-4 rounded-lg p-2 text-xs cursor-move hover:shadow-lg transition-shadow ${
                                      statusColors[apt.status]
                                    }`}
                                    style={{ height: `${height * 60 - 8}px`, zIndex: 5 }}
                                  >
                                    <div className="font-semibold truncate flex items-center gap-1">
                                      <span>{typeIcons[apt.type]}</span>
                                      <span>{apt.patientName}</span>
                                    </div>
                                    <div className="text-xs opacity-75 truncate">
                                      {format(aptStart, 'HH:mm')} - {format(new Date(apt.endTime), 'HH:mm')}
                                    </div>
                                    <div className="text-xs opacity-75 truncate">
                                      Dr. {apt.doctorName}
                                    </div>
                                    {apt.recurring && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Repeat className="w-3 h-3" />
                                        <span className="text-xs">Recurring</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Month View
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square bg-gray-50 dark:bg-gray-800/50 rounded-lg" />
                ))}

                {visibleDays.map((day, idx) => {
                  const dayAppointments = filteredAppointments.filter(apt =>
                    isSameDay(new Date(apt.startTime), day)
                  );
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={idx}
                      className={`aspect-square border rounded-lg p-2 cursor-pointer hover:shadow-md transition-all ${
                        isToday
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${statusColors[apt.status]}`}
                          >
                            {typeIcons[apt.type]} {format(new Date(apt.startTime), 'HH:mm')}
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 px-1">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Status Legend</h4>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 Tip: Drag appointments to reschedule • Click time slots to create new appointments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
