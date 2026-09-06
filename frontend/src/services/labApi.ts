// ----------------------------------------------------------------------------
// LABORATORY API SERVICE LAYER
// Note: These functions define the expected contracts with the backend.
// They currently throw "BACKEND_MISSING" to prevent fake persistence, but
// provide a clean integration point for the backend developer.
// ----------------------------------------------------------------------------

export const labApi = {
  /**
   * POST /api/lab/tests
   * Adds a test to the lab's catalog.
   */
  async createTest(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/lab/tests', payload);
    throw new Error('BACKEND_MISSING: POST /api/lab/tests is not implemented.');
  },

  /**
   * PATCH /api/lab/tests/:id
   * Enables or disables a catalog test.
   */
  async updateTestStatus(id: string, active: boolean): Promise<void> {
    console.log('[API Call] PATCH /api/lab/tests/:id', { id, active });
    throw new Error('BACKEND_MISSING: PATCH /api/lab/tests/:id is not implemented.');
  },

  /**
   * POST /api/lab/orders
   * Creates a lab test order for a patient.
   */
  async createOrder(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/lab/orders', payload);
    throw new Error('BACKEND_MISSING: POST /api/lab/orders is not implemented.');
  },

  /**
   * POST /api/lab/orders/:id/report
   * Uploads a report file and attaches it to an existing order.
   */
  async uploadReport(orderId: string, payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/lab/orders/:id/report', { orderId, payload });
    throw new Error('BACKEND_MISSING: POST /api/lab/orders/:id/report is not implemented.');
  },

  /**
   * POST /api/lab/packages
   * Creates a bundled test package.
   */
  async createPackage(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/lab/packages', payload);
    throw new Error('BACKEND_MISSING: POST /api/lab/packages is not implemented.');
  },

  /**
   * POST /api/lab/home-collections
   * Schedules a home sample collection.
   */
  async createHomeCollection(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/lab/home-collections', payload);
    throw new Error('BACKEND_MISSING: POST /api/lab/home-collections is not implemented.');
  },

  /**
   * PUT /api/lab/me
   * Updates the laboratory profile and home-collection settings.
   */
  async updateLabInfo(payload: unknown): Promise<void> {
    console.log('[API Call] PUT /api/lab/me', payload);
    throw new Error('BACKEND_MISSING: PUT /api/lab/me is not implemented.');
  },
};
