import { Quote } from "@/@types/quotes";
import axios from "axios";
import { ca, id } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "../use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { api } from "@/lib/axios/axios";

// Save data to localStorage
const saveToLocalStorage = (userId: string, quotes: Quote[]) => {
  try {
    localStorage.setItem(`quotes_${userId}`, JSON.stringify(quotes));
    console.log(
      `Saved ${quotes.length} quotes to localStorage for user ${userId}`
    );
  } catch (error) {
    console.error("Error saving quotes to localStorage:", error);
  }
};

// Get quotes from localStorage
const getQuotesFromLocalStorage = (userId: string): Quote[] => {
  try {
    const storedQuotes = localStorage.getItem(`quotes_${userId}`);
    if (storedQuotes) {
      const parsedQuotes = JSON.parse(storedQuotes);
      return parsedQuotes.map((quote: any) => ({
        ...quote,
        createdAt: new Date(quote.createdAt),
        validityCustomDate: quote.validityCustomDate
          ? new Date(quote.validityCustomDate)
          : undefined,
      }));
    }
  } catch (error) {
    console.error("Error loading quotes from localStorage:", error);
  }
  return [];
};

export const useQuoteActions = (
  quotes: Quote[],
  setQuotes: (quotes: Quote[]) => void
) => {
  const { clinic, setClinic } = useAuth.getState();

  const updateQuote = (updatedQuote: Quote) => {
    if (!clinic?.id) {
      toast.error("Erro", {
        description: `Você precisa estar logado para atualizar orçamentos`,
      });

      return;
    }

    // Verifica se o orçamento já existe
    const quoteExists = quotes.some((q) => q.id === updatedQuote.id);
    if (!quoteExists) {
      console.log(
        "Orçamento não encontrado para atualização, será criado:",
        updatedQuote.id
      );
      // createQuote(updatedQuote);
      return;
    }

    const updatedQuotes = quotes.map((q) =>
      q.id === updatedQuote.id ? updatedQuote : q
    );
    setQuotes(updatedQuotes);
    saveToLocalStorage(clinic?.id, updatedQuotes);

    toast("Orçamento atualizado", {
      description: `Orçamento para ${updatedQuote.patientName} atualizado com sucesso`,
    });
  };

  const deleteQuote = (id: string) => {
    if (!clinic?.id) {
      toast.error("Erro", {
        description: `Você precisa estar logado para excluir orçamentos`,
      });

      return;
    }

    const filteredQuotes = quotes.filter((q) => q.id !== id);
    setQuotes(filteredQuotes);
    saveToLocalStorage(clinic?.id, filteredQuotes);
    toast("Orçamento excluído", {
      description: `Orçamento excluído com sucesso`,
    });
  };

  return {
    updateQuote,
    deleteQuote,
    getQuotesFromLocalStorage,
  };
};
