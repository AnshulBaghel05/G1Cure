import { supabase, handleSupabaseError } from './supabase';

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
  pendingBills: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface AppointmentStats {
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface RevenueStats {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Run all queries in parallel for better performance
    const [
      { count: totalPatients },
      { count: totalDoctors },
      { count: totalAppointments },
      { count: todayAppointments },
      { data: billingData },
      { count: completedAppointments },
      { count: cancelledAppointments },
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', today),
      supabase.from('billing').select('total_amount, paid_amount, status'),
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelled'),
    ]);

    // Calculate revenue and pending bills
    let totalRevenue = 0;
    let pendingBills = 0;

    billingData?.forEach((bill) => {
      totalRevenue += bill.paid_amount || 0;
      if (bill.status === 'pending' || bill.status === 'partially_paid') {
        pendingBills += bill.total_amount - (bill.paid_amount || 0);
      }
    });

    return {
      totalPatients: totalPatients || 0,
      totalDoctors: totalDoctors || 0,
      totalAppointments: totalAppointments || 0,
      todayAppointments: todayAppointments || 0,
      totalRevenue,
      pendingBills,
      completedAppointments: completedAppointments || 0,
      cancelledAppointments: cancelledAppointments || 0,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get appointment statistics
export async function getAppointmentStats(
  dateRange?: { from: string; to: string }
): Promise<AppointmentStats> {
  try {
    let query = supabase.from('appointments').select('status');

    if (dateRange) {
      query = query
        .gte('appointment_date', dateRange.from)
        .lte('appointment_date', dateRange.to);
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);

    const stats: AppointmentStats = {
      scheduled: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0,
    };

    data?.forEach((appointment) => {
      if (appointment.status in stats) {
        stats[appointment.status as keyof AppointmentStats]++;
      }
    });

    return stats;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get revenue statistics
export async function getRevenueStats(
  dateRange?: { from: string; to: string }
): Promise<RevenueStats> {
  try {
    let query = supabase
      .from('billing')
      .select('total_amount, paid_amount, status');

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to);
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);

    const stats: RevenueStats = {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
    };

    data?.forEach((bill) => {
      stats.total += bill.total_amount;
      stats.paid += bill.paid_amount || 0;

      if (bill.status === 'pending' || bill.status === 'partially_paid') {
        stats.pending += bill.total_amount - (bill.paid_amount || 0);
      }

      if (bill.status === 'overdue') {
        stats.overdue += bill.total_amount - (bill.paid_amount || 0);
      }
    });

    return stats;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get monthly revenue chart data
export async function getMonthlyRevenue(months: number = 6) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('billing')
      .select('created_at, paid_amount')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('status', 'paid');

    if (error) throw handleSupabaseError(error);

    // Group by month
    const monthlyData: { [key: string]: number } = {};

    data?.forEach((bill) => {
      const month = new Date(bill.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      monthlyData[month] = (monthlyData[month] || 0) + (bill.paid_amount || 0);
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get appointment trends (daily for last 30 days)
export async function getAppointmentTrends() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date, status')
      .gte('appointment_date', startDate.toISOString().split('T')[0])
      .lte('appointment_date', endDate.toISOString().split('T')[0]);

    if (error) throw handleSupabaseError(error);

    // Group by date
    const dailyData: { [key: string]: { scheduled: number; completed: number } } = {};

    data?.forEach((appointment) => {
      const date = appointment.appointment_date;
      if (!dailyData[date]) {
        dailyData[date] = { scheduled: 0, completed: 0 };
      }

      if (appointment.status === 'scheduled' || appointment.status === 'confirmed') {
        dailyData[date].scheduled++;
      } else if (appointment.status === 'completed') {
        dailyData[date].completed++;
      }
    });

    return Object.entries(dailyData).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get top doctors by appointments
export async function getTopDoctors(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('doctor_id, doctors(first_name, last_name, specialization)')
      .eq('status', 'completed');

    if (error) throw handleSupabaseError(error);

    // Count appointments per doctor
    const doctorCounts: { [key: string]: any } = {};

    data?.forEach((appointment) => {
      const doctorId = appointment.doctor_id;
      if (!doctorCounts[doctorId]) {
        doctorCounts[doctorId] = {
          doctor: appointment.doctors,
          appointments: 0,
        };
      }
      doctorCounts[doctorId].appointments++;
    });

    // Sort and return top doctors
    return Object.values(doctorCounts)
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, limit);
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
