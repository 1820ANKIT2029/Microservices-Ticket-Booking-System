import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfileData } from "@/features/users/types/profile";
import { AppRole, JwtUtils } from "@/shared/utils";
import { BaseStore } from "./BaseStore";

export interface AuthState {
  user: UserProfileData | null;
  accessToken: string | null;
  role: AppRole;
}

class AuthStore extends BaseStore<AuthState> {
  constructor() {
    super(
      persist(
        () => ({
          user: null,
          accessToken: null,
          role: "CONSUMER",
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
      ) as any
    );
  }

  public login = (token: string, user: UserProfileData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    const role = JwtUtils.getRoleFromToken(token);
    this.setState({ accessToken: token, user, role });
  };

  public logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    this.setState({ accessToken: null, user: null, role: "CONSUMER" });
  };

  public setUser = (user: UserProfileData | null) => {
    this.setState({ user });
  };

  public setRole = (role: AppRole) => {
    this.setState({ role });
  };
}

export const authStore = new AuthStore();
export const useAuthStore = authStore.useSelector;
