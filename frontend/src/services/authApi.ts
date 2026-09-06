// ----------------------------------------------------------------------------
// AUTHENTICATION API SERVICE LAYER
// Note: These functions define the expected contracts with the backend.
// They currently throw "BACKEND_MISSING" so no authentication is ever faked on
// the client, but provide a clean integration point for the backend developer.
// ----------------------------------------------------------------------------

import type { Role } from "@/context/AuthContext";

export type Session = {
  token: string;
  role: Role;
};

export const authApi = {
  /**
   * POST /api/auth/login
   * Authenticates a user with credentials and returns the issued session.
   * The role MUST come from the backend — it is never chosen on the client.
   */
  async login(payload: { email: string; password: string }): Promise<Session> {
    console.log('[API Call] POST /api/auth/login', payload);
    throw new Error('BACKEND_MISSING: POST /api/auth/login is not implemented.');
  },

  /**
   * POST /api/auth/register
   * Submits a facility registration for admin verification.
   */
  async register(payload: unknown): Promise<{ id: string }> {
    console.log('[API Call] POST /api/auth/register', payload);
    throw new Error('BACKEND_MISSING: POST /api/auth/register is not implemented.');
  },
};
