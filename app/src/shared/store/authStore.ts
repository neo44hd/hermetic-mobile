import { create } from 'zustand';
import { clearAuth, readAuth, saveAuth } from '../auth/tokenStorage';
import { loginApi } from '../auth/authApi';
import type { AuthState } from '../types/auth';

type AuthActions = {
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const { token, user } = await readAuth();
      set({ token, user, hydrated: true, loading: false });
    } catch {
      set({ hydrated: true, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const data = await loginApi({ email, password });
    await saveAuth(data.accessToken, data.user);
    set({ token: data.accessToken, user: data.user, loading: false });
  },

  signOut: async () => {
    set({ loading: true });
    await clearAuth();
    set({ token: null, user: null, loading: false });
  },
}));
