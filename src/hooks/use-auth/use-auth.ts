// stores/useAuthStore.ts
import { create } from "zustand";
import { User, Clinic } from "@/@types/auth";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthStore } from "./types";

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  clinic: {} as Clinic,
  setClinic: (clinic: Clinic) => set({ clinic }),

  needsOnboarding: true,
  setNeedsOnboarding: (value) => set({ needsOnboarding: value }),

  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),

  logout: (router) => {
    const { setUser, setClinic, setNeedsOnboarding } = useAuth.getState();
    setUser(null);
    setClinic({} as Clinic);
    Cookies.remove("tokenClinitt");
    window.location.reload();
  },

  completeOnboarding: () => {
    const { setNeedsOnboarding } = useAuth.getState();
    setNeedsOnboarding(false);
  },
}));
