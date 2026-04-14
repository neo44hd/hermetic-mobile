import { ENV } from '../config/env';
import type { LoginRequest, LoginResponse } from '../types/auth';

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${ENV.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}) ${txt}`);
  }

  return res.json();
}
