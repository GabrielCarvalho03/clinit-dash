// store/useQuote.ts
import { create } from "zustand";
import { Quote, StandardTreatment, QuoteStatus } from "@/@types/quotes";
import { useQuoteActions } from "@/hooks/use-cotes/use-cotes-actions";
import { useQuoteQueries } from "@/hooks/use-cotes/use-quote-queries";

interface QuoteStore {
  quotes: Quote[];
  draftQuote: Quote | null;
  standardTreatments: StandardTreatment[];
  setDraftQuote: (quote: Quote | null) => void;
  createQuote: (quote: Quote) => Quote;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => Quote | undefined;
  getDentistQuotes: (dentistId: string) => Quote[];
  getRecentQuotes: (limit?: number) => Quote[];
  getQuotesCount: (dentistId?: string) => number;
  addCustomTreatment: (treatment: StandardTreatment) => void;
  editQuote: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  getPaidQuotesCount: (dentistId?: string) => number;
  getPaidQuotesValue: (dentistId?: string) => number;
  getConversionRate: (dentistId?: string) => number;
  loadUserQuotes: (userId: string) => void;
}

export const useQuote = create<QuoteStore>((set, get) => {
  const quotes: Quote[] = [];
  const standardTreatments: any = [];

  const updateLocalStorage = (procedures: StandardTreatment[]) => {
    localStorage.setItem("procedures", JSON.stringify(procedures));
  };

  const loadUserQuotes = (userId: string) => {
    const { setDraftQuote } = get();
    const { getQuotesFromLocalStorage } = useQuoteActions(
      userId,
      get().quotes,
      (q: Quote[]) => set({ quotes: q })
    );

    const loadedQuotes = getQuotesFromLocalStorage(userId);
    set({ quotes: loadedQuotes });

    try {
      const storedProcedures = localStorage.getItem("procedures");
      if (storedProcedures) {
        const parsed = JSON.parse(storedProcedures);
        const names = parsed.map((p: StandardTreatment) => p.name);
        const filteredInitial = [].filter((t: any) => !names.includes(t.name));
        set({ standardTreatments: [...parsed, ...filteredInitial] });
      }
    } catch (err) {
      console.error("Erro ao carregar procedimentos:", err);
    }
  };

  const { getQuotesFromLocalStorage, ...quoteActions } = useQuoteActions(
    "",
    get()?.quotes,
    (q: Quote[]) => set({ quotes: q })
  );
  const quoteQueries = useQuoteQueries(get()?.quotes);

  return {
    quotes,
    draftQuote: null,
    standardTreatments,
    setDraftQuote: (quote) => set({ draftQuote: quote }),

    createQuote: (quote) => quoteActions.createQuote(quote),
    updateQuote: (quote) => quoteActions.updateQuote(quote),
    deleteQuote: (id) => quoteActions.deleteQuote(id),
    getQuote: (id) => quoteQueries.getQuote(id),
    getDentistQuotes: (dentistId) => quoteQueries.getDentistQuotes(dentistId),
    getRecentQuotes: (limit) => quoteQueries?.getRecentQuotes(limit),
    getQuotesCount: (dentistId) => quoteQueries.getQuotesCount(dentistId),

    addCustomTreatment: (treatment) => {
      const current = get().standardTreatments;
      const exists = current.some((t) => t.name === treatment.name);
      const updated = exists
        ? current.map((t) => (t.name === treatment.name ? treatment : t))
        : [...current, treatment];

      set({ standardTreatments: updated });
      updateLocalStorage(updated);
    },

    editQuote: (id) => {
      const quote = get().quotes.find((q) => q.id === id);
      if (quote) {
        set({ draftQuote: { ...quote, status: "draft" } });
      }
    },

    updateQuoteStatus: (id, status) => {
      const quote = get().quotes.find((q) => q.id === id);
      if (quote) {
        get().updateQuote({ ...quote, status });
      }
    },

    getPaidQuotesCount: (dentistId) => {
      return get().quotes.filter(
        (q) => q.status === "paid" && (!dentistId || q.dentistId === dentistId)
      ).length;
    },

    getPaidQuotesValue: (dentistId) => {
      const filtered = get().quotes.filter(
        (q) => q.status === "paid" && (!dentistId || q.dentistId === dentistId)
      );
      return filtered.reduce(
        (sum, q) => sum + q.treatments.reduce((t, x) => t + x.price, 0),
        0
      );
    },

    getConversionRate: (dentistId) => {
      const all = get().quotes.filter(
        (q) =>
          (!dentistId || q.dentistId === dentistId) &&
          ["final", "paid", "follow"].includes(q.status)
      );
      const paid = all.filter((q) => q.status === "paid");
      return all.length > 0 ? (paid.length / all.length) * 100 : 0;
    },

    loadUserQuotes,
  };
});
