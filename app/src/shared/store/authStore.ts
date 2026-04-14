import { create } from 'zustand';
import type { AuthState, User } from '../types/auth';
import { clearAuth, readAuth, saveAuth } from '../auth/tokenStorage';

type AuthActions = {
  hydrate: () => Promise<void>;
  signInLocal: (email: string) => Promise<void>; // mock login por ahora
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

  signInLocal: async (email: string) => {
    set({ loading: true });
    const fakeToken = `local-token-${Date.now()}`;
    const user: User = { id: 'local-user', email, name: 'Local User' };
    await saveAuth(fakeToken, user);
    set({ token: fakeToken, user, loading: false });
  },

  signOut: async () => {
    set({ loading: true });
    await clearAuth();
    set({ token: null, user: null, loading: false });
  },
}));
