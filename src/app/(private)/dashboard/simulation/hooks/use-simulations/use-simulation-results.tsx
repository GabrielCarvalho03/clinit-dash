import { create } from "zustand";
import { UseSimulations } from "./types";

export const useSimulations = create<UseSimulations>((set) => ({
  activeTab: "upload",
  setActiveTab: (activeTab) => set({ activeTab }),
}));
