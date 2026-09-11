export interface DayAvailability {
  day: string;
  active: boolean;
  opStartTime: string;
  opEndTime: string;
  videoStartTime: string;
  videoEndTime: string;
  slotDurationMinutes?: number;
}

export interface AvailableSlotsResponse {
  doctorId: string;
  doctorName: string;
  date: string;
  dayOfWeek: string;
  isAvailable: boolean;
  allSlots: string[];
  availableSlots: string[];
  bookedSlots: string[];
}

const API_URL = 'http://127.0.0.1:5000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('mediquee_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const doctorApi = {
  /**
   * GET /api/v1/doctor/schedule
   * Loads the doctor's weekly working schedule.
   */
  async getAvailability(): Promise<DayAvailability[]> {
    const res = await fetch(`${API_URL}/api/v1/doctor/schedule`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to fetch doctor schedule');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * POST /api/v1/doctor/schedule
   * Saves the doctor's weekly OP + video consultation working hours.
   */
  async updateAvailability(schedule: DayAvailability[]): Promise<void> {
    const res = await fetch(`${API_URL}/api/v1/doctor/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ schedule }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to save doctor schedule');
    }
  },

  /**
   * GET /api/v1/doctors/:id/available-slots
   * Fetches calculated open time slots for a doctor on a specific date.
   */
  async getAvailableSlots(doctorId: string, date: string, type = 'OP'): Promise<AvailableSlotsResponse> {
    const params = new URLSearchParams({ date, type });
    const res = await fetch(`${API_URL}/api/v1/doctors/${doctorId}/available-slots?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to fetch available slots');
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * GET /api/v1/appointments/my
   * Fetches the doctor's consultations and appointments.
   */
  async getMyAppointments(): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/v1/appointments/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.data || [];
  }
};
