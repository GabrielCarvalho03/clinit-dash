import { create } from "zustand";

type ClinicStore = {
  saveIsLoading: boolean;
  setSaveIsLoading: (isLoading: boolean) => void;
};

export const useClinic = create<ClinicStore>((set) => ({
  saveIsLoading: false,
  setSaveIsLoading: (isLoading) => set({ saveIsLoading: isLoading }),
}));
