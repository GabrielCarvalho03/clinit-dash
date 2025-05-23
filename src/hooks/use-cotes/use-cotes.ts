// store/useQuote.ts
import { create } from "zustand";
import { Quote, StandardTreatment, QuoteStatus } from "@/@types/quotes";
import { useQuoteActions } from "@/hooks/use-cotes/use-cotes-actions";
import { useQuoteQueries } from "@/hooks/use-cotes/use-quote-queries";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { useAuth } from "../use-auth/use-auth";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";

interface QuoteStore {
  quotes: Quote[];
  setQuotes: (quotes: Quote[]) => void;
  draftQuote: Quote | null;
  standardTreatments: StandardTreatment[];
  setDraftQuote: (quote: Quote | null) => void;
  createQuote: (quote: Quote) => Promise<Quote | undefined>;
  updateQuote: (quote: Quote) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  getQuote: (clinicId: string) => Promise<Quote | undefined>;
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
  loadingDeleteQuote: boolean;
  setLoadingDeleteQuote: (value: boolean) => void;
  loadingUpdateQuote: boolean;
  setLoadingUpdateQuote: (value: boolean) => void;
}

export const useQuote = create<QuoteStore>((set, get) => {
  const quotes: Quote[] = [];
  const setQuotes: (quotes: Quote[]) => void = (quotes) => set({ quotes });
  const standardTreatments: any = [];

  const updateLocalStorage = (procedures: StandardTreatment[]) => {
    localStorage.setItem("procedures", JSON.stringify(procedures));
  };

  const loadUserQuotes = (userId: string) => {
    const { setDraftQuote } = get();
    const { getQuotesFromLocalStorage } = useQuoteActions(
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
    get()?.quotes,
    (q: Quote[]) => set({ quotes: q })
  );
  const quoteQueries = useQuoteQueries(get()?.quotes);

  return {
    quotes,
    setQuotes: (quotes) => set({ quotes }),
    draftQuote: null,
    standardTreatments,
    setDraftQuote: (quote) => set({ draftQuote: quote }),
    loadingDeleteQuote: false,

    loadingUpdateQuote: false,
    setLoadingUpdateQuote: (value: boolean) =>
      set({ loadingUpdateQuote: value }),
    setLoadingDeleteQuote: (value: boolean) =>
      set({ loadingDeleteQuote: value }),
    createQuote: async (quote: Quote) => {
      const { clinic, setClinic } = useAuth.getState();
      const { quotes, setQuotes } = useQuote.getState();
      const getClinic = await getUserRefresh(setClinic);
      console.log("getClinic", getClinic);

      if (!clinic) {
        toast.error("Erro", {
          description: ` Vocé precisa estar logado para criar orçamentos`,
        });
        return;
      }
      // Verificação para evitar duplicação
      const existingQuote = quotes?.find((q) => q.id === quote.id);
      if (existingQuote) {
        console.log("Orçamento já existe, não será duplicado:", quote.id);
        return quote;
      }
      let newQuote = {
        ...quote,
        ageGroup: quote.ageGroup,
        anchoragePercentage: quote.anchoragePercentage,
        dentistId: quote.dentistId,
        downPayment: quote.downPayment,
        gift: quote.gift,
        installments: quote.installments,
        observations: quote.observations,
        patientAge: quote.patientAge,
        patientBirthdate: quote.patientBirthdate,
        patientGender: quote.patientGender,
        patientName: quote.patientName,
        patientProfile: quote.patientProfile,
        paymentConditions: quote.paymentConditions,
        paymentPreviewText: quote.paymentPreviewText,
        relationship: quote.relationship,
        treatments: quote.treatments,
        validityCustomDate: quote.validityCustomDate,
        validityDays: quote.validityDays,
        createdAt: new Date(),
        clinicId: clinic?.id,
        id: "",
      };

      try {
        const handleCreate = await api.post("/quotes/create", newQuote);
        newQuote = {
          ...newQuote,
          id: handleCreate.data.id,
        };
        const updatedQuotes = [newQuote, ...quotes];
        setQuotes(updatedQuotes);
        toast("Orçamento criado", {
          description: `Orçamento para ${quote.patientName} criado com sucesso`,
        });
      } catch (err) {
        console.log(err);
        toast.error("Erro", {
          description: "Erro ao criar orçamento",
        });
      }

      return newQuote;
    },

    getQuote: async (clinicId: string) => {
      const { setQuotes } = useQuote.getState();

      try {
        const resQuote = await api.post("/quotes/get", {
          clinicId,
        });
        const AscQuote = resQuote.data.quotes?.sort(
          (a: Quote, b: Quote) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setQuotes(AscQuote);

        return AscQuote;
      } catch (err) {
        console.log(err);
        toast.error("Erro", {
          description: "Erro ao buscar orçamento",
        });
      }
    },

    updateQuote: async (quote) => {
      const { quotes, setQuotes, setLoadingUpdateQuote } = useQuote.getState();

      setLoadingUpdateQuote(true);
      try {
        const res = await api.post("/quotes/update", quote);
        const updatedQuotes = quotes.map((q) =>
          q.id === quote.id ? quote : q
        );
        setQuotes(updatedQuotes);
        toast("Orçamento atualizado", {
          description: `Orçamento para ${quote.patientName} atualizado com sucesso`,
        });
      } catch (err) {
        console.log(err);
        toast.error("Erro", {
          description: "Erro ao atualizar orçamento",
        });
      } finally {
        setLoadingUpdateQuote(false);
      }
    },

    deleteQuote: async (id) => {
      const { setLoadingDeleteQuote } = useQuote.getState();

      setLoadingDeleteQuote(true);
      try {
        const res = await api.post("/quotes/delete", { id });
        toast("Orçamento excluído", {
          description: `Orçamento excluído com sucesso`,
        });

        const updatedQuotes = get().quotes.filter((q) => q.id !== id);
        set({ quotes: updatedQuotes });
      } catch (err) {
        console.log(err);
        toast.error("Erro", {
          description: "Erro ao excluir orçamento",
        });
      } finally {
        setLoadingDeleteQuote(false);
      }
    },
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
