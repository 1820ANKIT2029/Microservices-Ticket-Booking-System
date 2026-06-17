import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserRole } from "@/shared/constants";
import { TOKEN_KEY, AUTH_STORAGE_KEY } from "@/shared/constants";
import { getRoleFromToken } from "@/shared/utils/jwt";
import type { UserProfileData } from "@/features/users/types";

export interface AuthState {
  user:        UserProfileData | null;
  accessToken: string | null;
  role:        UserRole;
  login:       (token: string, user: UserProfileData) => void;
  logout:      () => void;
  setUser:     (user: UserProfileData | null) => void;
  setRole:     (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,
      role:        "CONSUMER",

      login: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, token);
        }
        const role = getRoleFromToken(token);
        set({ accessToken: token, user, role });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
        }
        set({ accessToken: null, user: null, role: "CONSUMER" });
      },

      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem:    () => null,
          setItem:    () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
