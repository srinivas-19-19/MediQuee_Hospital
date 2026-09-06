// ----------------------------------------------------------------------------
// DOCTOR API SERVICE LAYER
// Note: These functions define the expected contracts with the backend.
// They currently throw "BACKEND_MISSING" to prevent fake persistence, but
// provide a clean integration point for the backend developer.
// ----------------------------------------------------------------------------

export const doctorApi = {
  /**
   * PUT /api/doctors/me/availability
   * Saves the doctor's weekly OP + video consultation working hours.
   */
  async updateAvailability(payload: unknown): Promise<void> {
    console.log('[API Call] PUT /api/doctors/me/availability', payload);
    throw new Error('BACKEND_MISSING: PUT /api/doctors/me/availability is not implemented.');
  },
};
