import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  telemedicineSessions: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
}

export interface AppointmentTrend {
  date: string;
  count: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface DoctorPerformance {
  doctorId: string;
  doctorName: string;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  averageRating?: number;
}

export interface TrendsRequest {
  period: 'day' | 'week' | 'month' | 'year';
}

export interface AppointmentTrendsResponse {
  trends: AppointmentTrend[];
}

export interface RevenueTrendsResponse {
  trends: RevenueTrend[];
}

export interface DoctorPerformanceResponse {
  doctors: DoctorPerformance[];
}

// Retrieves dashboard statistics.
export const getDashboardStats = api<void, DashboardStats>(
  { expose: true, method: "GET", path: "/analytics/dashboard", auth: true },
  async () => {
    const now = new Date();
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekStartDate.setHours(0, 0, 0, 0);
    const weekStart = weekStartDate.toISOString();

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    try {
      const [
        { count: totalPatients },
        { count: totalDoctors },
        { data: appointmentsData, error: appointmentsError },
        { data: billingData, error: billingError },
        { count: telemedicineSessions },
      ] = await Promise.all([
        supabaseAdmin.from('patients').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('doctors').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('appointments').select('status, appointment_date'),
        supabaseAdmin.from('billing').select('total_amount, status, created_at').eq('status', 'paid'),
        supabaseAdmin.from('telemedicine_sessions').select('*', { count: 'exact', head: true }),
      ]);

      if (appointmentsError || billingError) {
          console.error("Analytics error:", { appointmentsError, billingError });
          throw APIError.internal("Failed to fetch analytics data");
      }

      const appointmentsToday = appointmentsData?.filter(a => a.appointment_date >= todayStart && a.appointment_date <= todayEnd).length || 0;
      const appointmentsThisWeek = appointmentsData?.filter(a => a.appointment_date >= weekStart).length || 0;
      const appointmentsThisMonth = appointmentsData?.filter(a => a.appointment_date >= monthStart).length || 0;
      
      const revenueToday = billingData?.filter(b => b.created_at >= todayStart && b.created_at <= todayEnd).reduce((sum, b) => sum + b.total_amount, 0) || 0;
      const revenueThisWeek = billingData?.filter(b => b.created_at >= weekStart).reduce((sum, b) => sum + b.total_amount, 0) || 0;
      const revenueThisMonth = billingData?.filter(b => b.created_at >= monthStart).reduce((sum, b) => sum + b.total_amount, 0) || 0;
      const totalRevenue = billingData?.reduce((sum, b) => sum + b.total_amount, 0) || 0;

      const completedAppointments = appointmentsData?.filter(a => a.status === 'completed').length || 0;
      const cancelledAppointments = appointmentsData?.filter(a => a.status === 'cancelled').length || 0;
      const noShowAppointments = appointmentsData?.filter(a => a.status === 'no-show').length || 0;

      return {
        totalPatients: totalPatients || 0,
        totalDoctors: totalDoctors || 0,
        totalAppointments: appointmentsData?.length || 0,
        totalRevenue,
        appointmentsToday,
        appointmentsThisWeek,
        appointmentsThisMonth,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        telemedicineSessions: telemedicineSessions || 0,
        completedAppointments,
        cancelledAppointments,
        noShowAppointments,
      };
    } catch (error: any) {
      console.error("Error in getDashboardStats:", error);
      throw APIError.internal("Failed to retrieve dashboard statistics", { cause: error.message });
    }
  }
);

// Retrieves appointment trends.
export const getAppointmentTrends = api<TrendsRequest, AppointmentTrendsResponse>(
  { expose: true, method: "GET", path: "/analytics/appointment-trends", auth: true },
  async ({ period }) => {
    try {
      const { startDate, groupBy } = getPeriodDetails(period);

      const { data, error } = await supabaseAdmin.rpc('get_appointment_trends', {
        start_date: startDate.toISOString(),
        group_by_period: groupBy
      });

      if (error) {
        throw APIError.internal("Failed to fetch appointment trends", { cause: error });
      }

      return { trends: data.map((d: any) => ({ date: d.period, count: d.count })) };
    } catch (error: any) {
      console.error("Error in getAppointmentTrends:", error);
      throw APIError.internal("Failed to retrieve appointment trends", { cause: error.message });
    }
  }
);

// Retrieves revenue trends.
export const getRevenueTrends = api<TrendsRequest, RevenueTrendsResponse>(
  { expose: true, method: "GET", path: "/analytics/revenue-trends", auth: true },
  async ({ period }) => {
    try {
      const { startDate, groupBy } = getPeriodDetails(period);

      const { data, error } = await supabaseAdmin.rpc('get_revenue_trends', {
        start_date: startDate.toISOString(),
        group_by_period: groupBy
      });

      if (error) {
        throw APIError.internal("Failed to fetch revenue trends", { cause: error });
      }

      return { trends: data.map((d: any) => ({ date: d.period, revenue: d.revenue })) };
    } catch (error: any) {
      console.error("Error in getRevenueTrends:", error);
      throw APIError.internal("Failed to retrieve revenue trends", { cause: error.message });
    }
  }
);

// Retrieves doctor performance metrics.
export const getDoctorPerformance = api<void, DoctorPerformanceResponse>(
  { expose: true, method: "GET", path: "/analytics/doctor-performance", auth: true },
  async () => {
    try {
      const { data: doctors, error: doctorsError } = await supabaseAdmin
        .from('doctors')
        .select('id, first_name, last_name');
      
      const { data: appointments, error: appointmentsError } = await supabaseAdmin
        .from('appointments')
        .select('id, doctor_id, status');

      const { data: bills, error: billsError } = await supabaseAdmin
        .from('billing')
        .select('appointment_id, total_amount')
        .eq('status', 'paid');

      if (doctorsError || appointmentsError || billsError) {
        throw APIError.internal("Failed to fetch doctor performance data");
      }

      const performanceMap = new Map<string, { totalAppointments: number; completedAppointments: number; totalRevenue: number }>();

      doctors?.forEach(d => {
        performanceMap.set(d.id, { totalAppointments: 0, completedAppointments: 0, totalRevenue: 0 });
      });

      appointments?.forEach(a => {
        if (performanceMap.has(a.doctor_id)) {
          const perf = performanceMap.get(a.doctor_id)!;
          perf.totalAppointments++;
          if (a.status === 'completed') {
            perf.completedAppointments++;
          }
        }
      });

      bills?.forEach(b => {
        const appointment = appointments?.find(a => a.id === b.appointment_id);
        if (appointment && performanceMap.has(appointment.doctor_id)) {
          performanceMap.get(appointment.doctor_id)!.totalRevenue += b.total_amount;
        }
      });

      const performance: DoctorPerformance[] = doctors?.map(d => {
        const perf = performanceMap.get(d.id)!;
        return {
          doctorId: d.id,
          doctorName: `Dr. ${d.first_name} ${d.last_name}`,
          ...perf,
        };
      }).sort((a, b) => b.totalRevenue - a.totalRevenue) || [];

      return { doctors: performance };
    } catch (error: any) {
      console.error("Error in getDoctorPerformance:", error);
      throw APIError.internal("Failed to retrieve doctor performance", { cause: error.message });
    }
  }
);

function getPeriodDetails(period: 'day' | 'week' | 'month' | 'year') {
  const now = new Date();
  let startDate: Date;
  let groupBy: 'day' | 'week' | 'month';

  switch (period) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      groupBy = 'day'; // This is not a standard SQL group by, but we'll handle it in the function
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      groupBy = 'day';
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      groupBy = 'day';
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      groupBy = 'month';
      break;
    default:
      throw new Error('Invalid period');
  }
  return { startDate, groupBy };
}
