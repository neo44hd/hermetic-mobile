import { create } from 'zustand';
import { clearAuth, readAuth, saveAccessToken, saveAuth } from '../auth/tokenStorage';
import { loginApi, meApi } from '../auth/authApi';
import type { AuthState, Role } from '../types/auth';

type AuthActions = {
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
  setAccessToken: (token: string) => Promise<void>;
};

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
      const { accessToken, user } = await readAuth();

      if (accessToken) {
        try {
          const freshUser = await meApi(accessToken);
          set({
            accessToken,
            refreshToken: null,
            user: freshUser,
            hydrated: true,
            loading: false,
          });
          return;
        } catch {
          await clearAuth();
        }
      }

      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        hydrated: true,
        loading: false,
      });
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        hydrated: true,
        loading: false,
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const data = await loginApi({ email, password });
      await saveAuth(data.token, '', data.user);
      set({
        accessToken: data.token,
        refreshToken: null,
        user: data.user,
        loading: false,
      });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  signOut: async () => {
    set({ loading: true });
    await clearAuth();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: true,
      loading: false,
    });
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
