import { ENV } from '../config/env';
import type { LoginRequest, User } from '../types/auth';

type BackendLoginResponse = {
  token: string;
  user: User;
};

export async function loginApi(payload: LoginRequest): Promise<BackendLoginResponse> {
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

// Tu backend actual no usa refresh endpoint.
// Lo dejamos para no romper imports, pero forzamos error controlado.
export async function refreshApi(_: string): Promise<{ accessToken: string }> {
  throw new Error('Refresh no soportado por backend actual');
}

export async function meApi(accessToken: string): Promise<User> {
  const res = await fetch(`${ENV.API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Me failed (${res.status}) ${txt}`);
  }

  return res.json();
}
