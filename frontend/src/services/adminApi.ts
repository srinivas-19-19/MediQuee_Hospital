// ----------------------------------------------------------------------------
// ADMIN / HOSPITAL API SERVICE LAYER
// ----------------------------------------------------------------------------

const API_URL = 'http://localhost:5000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('mediquee_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const adminApi = {
  /**
   * GET /api/v1/departments
   * Fetch hospital departments
   */
  async getDepartments(): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/v1/departments`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch departments');
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * POST /api/v1/departments
   * Creates a hospital department.
   */
  async createDepartment(payload: unknown): Promise<{ id: string }> {
    const res = await fetch(`${API_URL}/api/v1/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to create department');
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * PATCH /api/v1/departments/:id
   * Updates a hospital department.
   */
  async updateDepartment(id: string, payload: unknown): Promise<{ id: string }> {
    const res = await fetch(`${API_URL}/api/v1/departments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to update department');
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * DELETE /api/v1/departments/:id
   * Deletes a hospital department.
   */
  async deleteDepartment(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/v1/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to delete department');
    }
  },
  async getStaff(): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/v1/staff`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch staff');
    }
    const data = await res.json();
    return data.data;
  },

  async createStaff(payload: unknown): Promise<{ id: string }> {
    const res = await fetch(`${API_URL}/api/v1/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to create staff');
    }
    const data = await res.json();
    return data.data;
  },

  async updateStaff(id: string, payload: unknown): Promise<{ id: string }> {
    const res = await fetch(`${API_URL}/api/v1/staff/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to update staff');
    }
    const data = await res.json();
    return data.data;
  },

  async deactivateStaff(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/v1/staff/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to deactivate staff');
    }
  },

  /**
   * POST /api/marketing-requests
   * Submits a hospital marketing service enquiry.
   */
  async requestMarketing(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/marketing-requests', payload);
    throw new Error('BACKEND_MISSING: POST /api/marketing-requests is not implemented.');
  },

  /**
   * POST /api/medical-camp-requests
   * Submits a community medical camp booking request.
   */
  async requestMedicalCamp(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/medical-camp-requests', payload);
    throw new Error('BACKEND_MISSING: POST /api/medical-camp-requests is not implemented.');
  },

  /**
   * GET /api/v1/permissions/roles/:role
   * Fetch permissions for a specific role
   */
  async getPermissions(role: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/api/v1/permissions/roles/${role}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to fetch permissions');
    }
    const data = await res.json();
    return data.data;
  },

  /**
   * PUT /api/v1/permissions/roles/:role
   * Update permissions for a specific role
   */
  async updatePermissions(role: string, permissions: Record<string, boolean>): Promise<void> {
    const res = await fetch(`${API_URL}/api/v1/permissions/roles/${role}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permissions }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to update permissions');
    }
  },
};
