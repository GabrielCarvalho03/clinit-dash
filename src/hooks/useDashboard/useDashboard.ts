import { create } from "zustand";
import { useDashboardProps } from "./types";
import dayjs from "dayjs";
import { api } from "@/lib/axios/axios";

export const useDashboard = create<useDashboardProps>((set) => ({
  handleAccessDayChange: async (clinic) => {
    if (
      clinic.lastAccess === undefined ||
      dayjs(clinic.lastAccess).isBefore(dayjs(), "day")
    ) {
      await api.post("/lastAccess", { clinicId: clinic.id });
    }
  },
}));
