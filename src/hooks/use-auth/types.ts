import { User, Clinic } from "@/@types/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;

  clinic: Clinic | null;
  setClinic: (clinic: Clinic) => void;

  needsOnboarding: boolean;
  setNeedsOnboarding: (value: boolean) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;

  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  completeOnboarding: () => void;

  logout: (router: AppRouterInstance) => void;
}
