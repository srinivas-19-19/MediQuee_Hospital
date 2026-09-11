export interface DashboardAppointment {
  id: string;
  date?: string;
  time: string;
  name: string;
  dept: string;
  doctor: string;
  status: string;
  statusColor: string;
  avatar: string;
}

export interface RevenueTrendItem {
  name: string;
  revenue: number;
}

export interface DashboardOverview {
  totalOPs: number;
  pendingOPs: number;
  upcomingOPs?: number;
  labTests: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueTrend: RevenueTrendItem[];
  todayAppointments: DashboardAppointment[];
  upcomingAppointments?: DashboardAppointment[];
}

const API_URL = 'http://127.0.0.1:5000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('mediquee_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const dashboardApi = {
  /**
   * GET /api/v1/hospital/dashboard/overview
   * Fetches real-time aggregate hospital overview metrics for today and this week.
   */
  async getOverview(): Promise<DashboardOverview> {
    const res = await fetch(`${API_URL}/api/v1/hospital/dashboard/overview`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch dashboard overview');
    }

    const json = await res.json();
    return json.data;
  },
};
