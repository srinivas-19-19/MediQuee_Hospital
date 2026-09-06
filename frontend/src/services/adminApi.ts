// ----------------------------------------------------------------------------
// ADMIN / HOSPITAL API SERVICE LAYER
// Note: These functions define the expected contracts with the backend.
// They currently throw "BACKEND_MISSING" to prevent fake persistence, but
// provide a clean integration point for the backend developer.
// ----------------------------------------------------------------------------

export const adminApi = {
  /**
   * POST /api/departments
   * Creates a hospital department.
   */
  async createDepartment(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/departments', payload);
    throw new Error('BACKEND_MISSING: POST /api/departments is not implemented.');
  },

  /**
   * POST /api/doctors
   * Creates a doctor profile.
   */
  async createDoctor(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/doctors', payload);
    throw new Error('BACKEND_MISSING: POST /api/doctors is not implemented.');
  },

  /**
   * POST /api/nurses
   * Creates a nurse profile.
   */
  async createNurse(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/nurses', payload);
    throw new Error('BACKEND_MISSING: POST /api/nurses is not implemented.');
  },

  /**
   * POST /api/receptionists
   * Creates a receptionist profile.
   */
  async createReceptionist(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/receptionists', payload);
    throw new Error('BACKEND_MISSING: POST /api/receptionists is not implemented.');
  },

  /**
   * POST /api/labs
   * Creates a laboratory.
   */
  async createLab(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/labs', payload);
    throw new Error('BACKEND_MISSING: POST /api/labs is not implemented.');
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
};
