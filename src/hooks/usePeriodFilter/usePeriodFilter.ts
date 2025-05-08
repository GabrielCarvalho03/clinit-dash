// stores/usePeriodFilterStore.ts
import { create } from "zustand";
import { Quote } from "@/@types/quotes";
import { subMonths, subYears } from "date-fns";

export type PeriodFilterTypes = "all" | "month" | "quarter" | "year" | "custom";

interface PeriodFilterState {
  periodFilter: PeriodFilterTypes;
  startDate?: Date;
  endDate?: Date;
  setPeriodFilter: (period: PeriodFilterTypes) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  getFilteredQuotes: (quotes: Quote[]) => Quote[];
}

export const usePeriodFilter = create<PeriodFilterState>((set, get) => ({
  periodFilter: "all",
  startDate: undefined,
  endDate: undefined,

  setPeriodFilter: (period) => set({ periodFilter: period }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),

  getFilteredQuotes: (quotes) => {
    const { periodFilter, startDate, endDate } = get();
    const now = new Date();

    return quotes.filter((quote) => {
      const quoteDate = new Date(quote.createdAt);

      if (periodFilter === "month") {
        return quoteDate >= subMonths(now, 1);
      }
      if (periodFilter === "quarter") {
        return quoteDate >= subMonths(now, 3);
      }
      if (periodFilter === "year") {
        return quoteDate >= subYears(now, 1);
      }
      if (periodFilter === "custom") {
        if (startDate && quoteDate < startDate) return false;
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          if (quoteDate >= nextDay) return false;
        }
      }

      return true;
    });
  },
}));
