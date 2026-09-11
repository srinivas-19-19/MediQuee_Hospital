export interface ServicePayout {
  revenue: number;
  count: number;
}

export interface PayoutByService {
  op: ServicePayout;
  videoConsultation: ServicePayout;
  homeNursing: ServicePayout;
  labTests: ServicePayout;
  homeSampleCollection: ServicePayout;
}

export interface PayoutSummary {
  totalTransactions: number;
  averagePayout: number;
  thisMonth: number;
  lastMonth: number;
}

export interface PayoutTrendItem {
  name: string;
  value: number;
}

export interface PayoutTransaction {
  id: string;
  service: string;
  type: string;
  date: string;
  amount: number;
  status: string;
  statusColor: string;
  patientName: string;
}

export interface PayoutsResponse {
  totalPayout: number;
  byService: PayoutByService;
  payoutSummary: PayoutSummary;
  payoutTrend: PayoutTrendItem[];
  recentTransactions: PayoutTransaction[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const API_URL = 'http://127.0.0.1:5000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('mediquee_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const payoutsApi = {
  /**
   * GET /api/v1/hospital/payouts
   * Fetches real aggregated financial data broken down by service types and filtered by date range.
   */
  async getPayouts(startDate?: string, endDate?: string): Promise<PayoutsResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_URL}/api/v1/hospital/payouts${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch payouts data');
    }

    const json = await res.json();
    return json.data;
  },
};
