import { create } from "zustand";
import { SortField, SortOrder, useReportProps } from "./types";
import { Quote, QuotePdf } from "@/@types/quotes";
import { pdf } from "@react-pdf/renderer";
import { MyPDFDocument } from "../components/pdf/rerender";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { prepareQuotePdfData } from "@/utils/quoteDataPreparation";
import { addDays, subMonths, subYears } from "date-fns";
import { format } from "date-fns";
import { api } from "@/lib/axios/axios";

export const useReport = create<useReportProps>((set) => ({
  dentistFilter: "all",
  setDentistFilter: (value: string) => set({ dentistFilter: value }),
  periodFilter: "all",
  setPeriodFilter: (value: string) => set({ periodFilter: value }),
  startDate: undefined,
  setStartDate: (value: Date | undefined) => set({ startDate: value }),
  endDate: undefined,
  setEndDate: (value: Date | undefined) => set({ endDate: value }),
  selectedQuote: null,
  setSelectedQuote: (value: QuotePdf | null) => set({ selectedQuote: value }),
  viewDialogOpen: false,
  setViewDialogOpen: (value: boolean) => set({ viewDialogOpen: value }),
  deleteDialogOpen: false,
  setDeleteDialogOpen: (value: boolean) => set({ deleteDialogOpen: value }),
  quoteToDelete: null,
  setQuoteToDelete: (value: string | null) => set({ quoteToDelete: value }),
  quoteToUpdate: null,
  setQuoteToUpdate: (value: string | null) => set({ quoteToUpdate: value }),
  exporting: false,
  setExporting: (value: boolean) => set({ exporting: value }),
  sortField: "date",
  setSortField: (value: SortField) => set({ sortField: value }),
  sortOrder: "desc",
  setSortOrder: (value: SortOrder) => set({ sortOrder: value }),

  getFilteredQuotes: () => {
    const { dentistFilter, periodFilter, startDate, endDate } =
      useReport.getState();
    const { quotes } = useQuote.getState();

    const now = new Date();

    return quotes.filter((quote) => {
      const quoteDate = new Date(quote.createdAt);

      if (dentistFilter !== "all" && quote.dentistId !== dentistFilter) {
        return false;
      }

      if (periodFilter !== "all") {
        if (periodFilter === "month") {
          if (quoteDate < subMonths(now, 1)) return false;
        } else if (periodFilter === "quarter") {
          if (quoteDate < subMonths(now, 3)) return false;
        } else if (periodFilter === "year") {
          if (quoteDate < subYears(now, 1)) return false;
        } else if (periodFilter === "custom") {
          if (startDate && quoteDate < startDate) return false;
          if (endDate && quoteDate >= addDays(endDate, 1)) return false;
        }
      }

      return true;
    });
  },

  handleEditQuote: (id, router) => {
    const { editQuote } = useQuote.getState();
    editQuote(id);
    router.push("/dashboard/quote/edit-quote");
  },
  handleDeleteQuote: (id: string) => {
    const { setQuoteToDelete, setDeleteDialogOpen } = useReport.getState();

    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  },
  confirmDeleteQuote: async () => {
    const { deleteQuote } = useQuote.getState();
    const { quoteToDelete, setDeleteDialogOpen, setQuoteToDelete } =
      useReport.getState();
    if (quoteToDelete) {
      await deleteQuote(quoteToDelete);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  },
  handleViewQuote: (id) => {
    const { quotes } = useQuote.getState();
    const { clinic } = useAuth.getState();
    const { dentists } = useAnalytics.getState();
    const { setSelectedQuote, setViewDialogOpen } = useReport.getState();
    const quote = quotes.find((q) => q.id === id);
    if (!quote || !clinic) return;

    const dentist = dentists?.find((d) => d.id === quote.dentistId);
    if (!dentist) return;

    const quotePdfData = prepareQuotePdfData(quote, clinic, dentist);

    setSelectedQuote(quotePdfData);
    setViewDialogOpen(true);
  },
  handleStatusChange: async (id, status) => {
    const { setQuoteToUpdate } = useReport.getState();
    const { updateQuoteStatus } = useQuote.getState();
    setQuoteToUpdate(id);
    updateQuoteStatus(id, status);
  },
  getBase64FromUrl: async (url) => {
    // Se a URL já for Base64 ou Blob, retorna ela mesma
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      return url;
    }

    try {
      const response = await api.post("/files/get", { url });
      // Assume que a resposta.data.base64 já inclui o prefixo 'data:image/jpeg;base64,' ou similar
      return response.data.base64;
    } catch (err) {
      console.warn("Erro ao converter imagem para base64:", url, err);
      // Retorna uma string vazia ou um placeholder em caso de erro,
      // ou você pode re-throw o erro se quiser que a geração do PDF falhe.
      return ""; // Ou uma URL de imagem de placeholder genérica
    }
  },
  generateProposalPDF: async (quote) => {
    const { setExporting, getBase64FromUrl } = useReport.getState();

    const quoteDataForPdf = JSON.parse(JSON.stringify(quote)) as QuotePdf;
    if (!quote) {
      console.error("Nenhum dado de cotação fornecido.");
      return;
    }

    setExporting(true);

    // Logo da clínica
    if (
      quoteDataForPdf.clinic.logo &&
      quoteDataForPdf.clinic.logo.trim() !== ""
    ) {
      quoteDataForPdf.clinic.logo = await getBase64FromUrl(
        quoteDataForPdf.clinic.logo
      );
    }

    // Foto do dentista
    if (
      quoteDataForPdf.dentist.photo &&
      quoteDataForPdf.dentist.photo.trim() !== ""
    ) {
      quoteDataForPdf.dentist.photo = await getBase64FromUrl(
        quoteDataForPdf.dentist.photo
      );
    }

    // Ilustrações (mapeie cada imagem para sua versão Base64)
    if (
      quoteDataForPdf.illustrations &&
      quoteDataForPdf.illustrations.length > 0
    ) {
      const convertedIllustrations = await Promise.all(
        quoteDataForPdf.illustrations.map(async (img) => {
          if (img.url && img.url.trim() !== "") {
            const base64Url = await getBase64FromUrl(img.url);
            return { ...img, url: base64Url };
          }
          return img; // Retorna a imagem original se não tiver URL
        })
      );
      // Filtra ilustrações que falharam na conversão ou não tinham URL
      quoteDataForPdf.illustrations = convertedIllustrations.filter(
        (img) => img.url && img.url.trim() !== ""
      );
    }

    // Ativa o estado de exportando

    try {
      // 1. Crie a instância do seu documento PDF com os dados
      const doc = <MyPDFDocument quoteData={quoteDataForPdf} />;

      // 2. Gere o blob do PDF usando o método 'pdf' do react-pdf/renderer
      const blob = await pdf(doc).toBlob();

      // 3. Defina o nome do arquivo
      const fileName = `Proposta-${quote.patientName}-${format(
        new Date(quote.date),
        "dd-MM-yyyy"
      )}.pdf`;

      // 4. Crie um URL para o Blob
      const url = URL.createObjectURL(blob);

      // ABORDAGEM A: Abrir em uma nova aba (mais comum para visualização)
      window.open(url, "_blank");

      // ABORDAGEM B: Forçar o download usando um link dinâmico (Substitui saveAs)
      // Se você não quer usar file-saver, esta é a alternativa nativa do navegador
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Define o nome do arquivo para download
      document.body.appendChild(a); // Adiciona o link ao DOM (temporariamente)
      a.click(); // Simula um clique no link para iniciar o download
      document.body.removeChild(a); // Remove o link do DOM

      // Lembre-se de revogar o URL para liberar memória
      URL.revokeObjectURL(url);

      console.log("PDF gerado e aberto/baixado sem file-saver.");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      // toast.error("Erro ao gerar PDF", {
      //   description: "Ocorreu um erro ao gerar o PDF.",
      // });
    } finally {
      setExporting(false); // Desativa o estado de exportando
    }
  },

  getSortedQuotes: (): Quote[] => {
    const { sortField, sortOrder, getFilteredQuotes } = useReport.getState();
    const dentists = useAnalytics.getState().dentists;

    const filteredQuotes = getFilteredQuotes(); // garante que a função tenha retorno

    return [...filteredQuotes].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "patient":
          compareValue = a.patientName.localeCompare(b.patientName);
          break;

        case "dentist": {
          const dentistA =
            dentists.find((d) => d.id === a.dentistId)?.name || "Desconhecido";
          const dentistB =
            dentists.find((d) => d.id === b.dentistId)?.name || "Desconhecido";
          compareValue = dentistA.localeCompare(dentistB);
          break;
        }

        case "date":
          compareValue =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;

        case "value": {
          const totalA = a.treatments.reduce((sum, t) => sum + t.price, 0);
          const totalB = b.treatments.reduce((sum, t) => sum + t.price, 0);
          compareValue = totalA - totalB;
          break;
        }

        case "status":
          compareValue = a.status.localeCompare(b.status);
          break;

        default:
          compareValue = 0;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  },
}));
