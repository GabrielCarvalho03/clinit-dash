import { Quote } from "@/@types/quotes";

export const useQuoteQueries = (quotes: Quote[]) => {
  const getQuote = (id: string) => {
    return quotes.find((q) => q.id === id);
  };

  const getDentistQuotes = (dentistId: string) => {
    return quotes.filter((q) => q.dentistId === dentistId);
  };

  const getRecentQuotes = (limit: number = 10) => {
    return [...quotes]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  };

  const getQuotesCount = (dentistId?: string) => {
    if (!dentistId) return quotes.length;
    return quotes.filter((q) => q.dentistId === dentistId).length;
  };

  return {
    getQuote,
    getDentistQuotes,
    getRecentQuotes,
    getQuotesCount,
  };
};
