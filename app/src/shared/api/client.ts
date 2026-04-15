import { ENV } from '../config/env';
import { refreshApi } from '../auth/authApi';
import { useAuthStore } from '../store/authStore';

let refreshingPromise: Promise<string> | null = null;

async function getFreshAccessToken(): Promise<string> {
  if (!refreshingPromise) {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) throw new Error('No refresh token');

    refreshingPromise = refreshApi(refreshToken)
      .then(async (r) => {
        await useAuthStore.getState().setAccessToken(r.accessToken);
        return r.accessToken;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
}

export async function apiFetch<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${ENV.API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && retry) {
    try {
      const newAccess = await getFreshAccessToken();
      const retryHeaders = { ...headers, Authorization: `Bearer ${newAccess}` };
      const retryRes = await fetch(`${ENV.API_URL}${path}`, { ...init, headers: retryHeaders });

      if (!retryRes.ok) {
        if (retryRes.status === 401) await useAuthStore.getState().signOut();
        const txt = await retryRes.text().catch(() => '');
        throw new Error(`API ${retryRes.status}: ${txt || retryRes.statusText}`);
      }

      const ct2 = retryRes.headers.get('content-type') || '';
      if (ct2.includes('application/json')) return (await retryRes.json()) as T;
      return (await retryRes.text()) as T;
    } catch {
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, opacity: 0.75 },
  me: { fontSize: 12, opacity: 0.8, marginTop: 8 },
  admin: { color: 'green', fontWeight: '600' },
  user: { color: '#a66b00', fontWeight: '600' },
});
