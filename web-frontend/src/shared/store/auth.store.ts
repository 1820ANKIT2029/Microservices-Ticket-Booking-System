import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfileData } from "@/features/users/types/profile";
import { getRoleFromToken, AppRole } from "@/shared/utils/jwt";

export interface AuthState {
  user: UserProfileData | null;
  accessToken: string | null;
  role: AppRole;
  login: (token: string, user: UserProfileData) => void;
  logout: () => void;
  setUser: (user: UserProfileData | null) => void;
  setRole: (role: AppRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: "CONSUMER",
      login: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        const role = getRoleFromToken(token);
        set({ accessToken: token, user, role });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ accessToken: null, user: null, role: "CONSUMER" });
      },
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "eventpass-auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
