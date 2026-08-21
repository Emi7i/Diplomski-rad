import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  token: string | null;
  setAuth: (token: string, user: { email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      setAuth: (token, user) =>
        set({
          isAuthenticated: true,
          token,
          user,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
