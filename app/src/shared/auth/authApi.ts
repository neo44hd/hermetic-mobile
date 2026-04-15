import { ENV } from '../config/env';
import type { LoginRequest, LoginResponse, RefreshResponse, User } from '../types/auth';

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

export async function refreshApi(refreshToken: string): Promise<RefreshResponse> {
  const res = await fetch(`${ENV.API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Refresh failed (${res.status}) ${txt}`);
  }
  return res.json();
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
type AuthStore = AuthState & AuthActions;
export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const { accessToken, refreshToken, user } = await readAuth();

      if (accessToken && refreshToken) {
        try {
          // valida token actual
          const freshUser = await meApi(accessToken);
          set({ accessToken, refreshToken, user: freshUser, hydrated: true, loading: false });
          return;
        } catch {
          // intenta refresh silencioso
          const refreshed = await refreshApi(refreshToken);
          await saveAccessToken(refreshed.accessToken);
          const freshUser = await meApi(refreshed.accessToken);
          set({
            accessToken: refreshed.accessToken,
            refreshToken,
            user: freshUser,
            hydrated: true,
            loading: false,
          });
          return;
        }
      }

      set({ accessToken, refreshToken, user, hydrated: true, loading: false });
    } catch {
      set({ hydrated: true, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const data = await loginApi({ email, password });
    await saveAuth(data.accessToken, data.refreshToken, data.user);
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      loading: false,
    });
  },

  signOut: async () => {
    set({ loading: true });
    await clearAuth();
    set({ accessToken: null, refreshToken: null, user: null, loading: false });
  },

  hasRole: (roles: Role[]) => {
    const role = get().user?.role;
    if (!role) return false;
    return roles.includes(role);
  },

  setAccessToken: async (token: string) => {
    await saveAccessToken(token);
    set({ accessToken: token });
  },
}));
