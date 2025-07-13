import { create } from "zustand";
import { UseSimulationConfig } from "./types";

export const useSimulationConfig = create<UseSimulationConfig>((set) => ({
  corDentes: "natural",
  setCorDentes: (value) => set({ corDentes: value }),
  aspectoDentes: "natural",
  setAspectoDentes: (value) => set({ aspectoDentes: value }),
  alinhamento: "natural",
  setAlinhamento: (value) => set({ alinhamento: value }),
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  uploadedFile: null,
  setUploadedFile: (file) => set({ uploadedFile: file }),
}));
