import { Quote } from "@/@types/quotes";

export const useQuoteQueries = (quotes: Quote[]) => {
  const getQuote = (id: string) => {
    return quotes.find((q) => q.id === id);
  };

  const getDentistQuotes = (dentistId: string) => {
    return quotes.filter((q) => q.dentistId === dentistId);
  };

  const getRecentQuotes = (limit: number = 10): Quote[] => {
    // Adicionar tipo de retorno explícito
    // Certifique-se de que 'quotes' aqui se refere ao estado atual do store.
    // Se esta função estiver dentro do create(), use get().quotes
    // Ex: const currentQuotes = get().quotes;
    const currentQuotes = quotes; // Adapte conforme necessário para acessar o estado atual

    if (!currentQuotes || !currentQuotes.length) {
      return [];
    }

    // Função auxiliar para obter timestamp seguro
    const getSafeTime = (quote: Quote | undefined | null): number => {
      if (!quote || !quote.createdAt) {
        return -Infinity; // Ou 0, ou Infinity, dependendo de onde quer itens sem data
      }
      if (quote.createdAt instanceof Date) {
        const time = quote.createdAt.getTime();
        // Retorna -Infinity se for 'Invalid Date', senão retorna o timestamp
        return isNaN(time) ? -Infinity : time;
      }
      // Tenta converter se não for Date (ex: string, número)
      try {
        const date = new Date(quote.createdAt as any); // 'as any' para tentar a conversão
        const time = date.getTime();
        return isNaN(time) ? -Infinity : time; // Retorna -Infinity se a conversão falhar
      } catch (e) {
        return -Infinity; // Retorna -Infinity em caso de erro na conversão
      }
    };

    // Cria cópia e ordena
    const sortedQuotes = [...currentQuotes].sort((a, b) => {
      const timeA = getSafeTime(a);
      const timeB = getSafeTime(b);
      // Ordena decrescente (mais recentes primeiro)
      return timeB - timeA;
    });

    return sortedQuotes.slice(0, limit);
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
