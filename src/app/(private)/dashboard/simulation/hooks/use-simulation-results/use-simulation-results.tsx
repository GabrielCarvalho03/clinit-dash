import { create } from "zustand";
import { UseSimulationResult } from "./types";

export const useSimulationResults = create<UseSimulationResult>((set) => ({
  imageResult: "",
  setImageResult: (imageResult) => set({ imageResult }),
}));
