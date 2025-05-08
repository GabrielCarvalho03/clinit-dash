import { Quote } from "@/@types/quotes";
import { toast } from "sonner";

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
  userId: string | undefined,
  quotes: Quote[],
  setQuotes: (quotes: Quote[]) => void
) => {
  const createQuote = (quote: Quote) => {
    if (!userId) {
      toast.error("Erro", {
        description: "Você precisa estar logado para criar orçamentos",
      });
      return quote;
    }

    // Verificação para evitar duplicação
    const existingQuote = quotes.find((q) => q.id === quote.id);
    if (existingQuote) {
      console.log("Orçamento já existe, não será duplicado:", quote.id);
      return quote;
    }

    const newQuote = {
      ...quote,
      id: quote.id || crypto.randomUUID(),
      createdAt: new Date(),
    };

    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);
    saveToLocalStorage(userId, updatedQuotes);
    toast("Orçamento criado", {
      description: `Orçamento para ${quote.patientName} criado com sucesso`,
    });

    return newQuote;
  };

  const updateQuote = (updatedQuote: Quote) => {
    if (!userId) {
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
      createQuote(updatedQuote);
      return;
    }

    const updatedQuotes = quotes.map((q) =>
      q.id === updatedQuote.id ? updatedQuote : q
    );
    setQuotes(updatedQuotes);
    saveToLocalStorage(userId, updatedQuotes);

    toast("Orçamento atualizado", {
      description: `Orçamento para ${updatedQuote.patientName} atualizado com sucesso`,
    });
  };

  const deleteQuote = (id: string) => {
    if (!userId) {
      toast.error("Erro", {
        description: `Você precisa estar logado para excluir orçamentos`,
      });

      return;
    }

    const filteredQuotes = quotes.filter((q) => q.id !== id);
    setQuotes(filteredQuotes);
    saveToLocalStorage(userId, filteredQuotes);
    toast("Orçamento excluído", {
      description: `Orçamento excluído com sucesso`,
    });
  };

  return {
    createQuote,
    updateQuote,
    deleteQuote,
    getQuotesFromLocalStorage,
  };
};
