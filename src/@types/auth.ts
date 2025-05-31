export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  photo: string;
}

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  description?: string;
  firstLogin?:boolean;
  logo?: string | null;
  phoneNumber?: string;
  phoneNumber2?: string;
  cnpj?: string; // Adding CNPJ field
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    whatsapp?: string;
  };
  dentists?: Dentist[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: "client" | "admin";
  photo?: string;
  company?: string;
  createdAt: Date;
  onboardingCompleted?: boolean;
}

export interface AuthContextData {
  user: User | null;
  clinic: Clinic | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword?: (email: string) => Promise<void>;
  updateClinic: (clinicData: Partial<Clinic>) => void;
  updateUser: (userData: Partial<User>) => void;
  completeOnboarding: () => void;
  needsOnboarding: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
