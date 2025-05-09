import { create } from "zustand";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

// Tipo para os dados da exportação
type QuoteExportData = {
  type:
    | "pdf-images"
    | "pdf-no-images"
    | "print-images"
    | "print-no-images"
    | "word";
  elementId: string;
  patientName: string;
};

type QuoteExportStore = {
  exporting: boolean;
  handleExport: (data: QuoteExportData) => Promise<void>;
  setExporting: (exporting: boolean) => void;
};

// Criando o store com Zustand
export const useQuoteExport = create<QuoteExportStore>((set) => ({
  exporting: false,
  setExporting: (exporting) => set({ exporting }),
  handleExport: async ({
    type,
    elementId = "quote-preview-container",
    patientName = "paciente",
  }: QuoteExportData) => {
    set({ exporting: true });

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Preview element not found");
      }

      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      // Cria o canvas com maior escala para melhor qualidade
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF", // Fundo branco para o PDF
        width: elementWidth,
        height: elementHeight,
        imageTimeout: 0,
        logging: false,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img) => {
            img.style.backgroundColor = "transparent";
          });
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 0;
      const contentWidth = pageWidth;
      const aspectRatio = canvas.width / canvas.height;
      const contentHeight = contentWidth / aspectRatio;

      pdf.addImage(
        canvas.toDataURL("image/png", 1.0), // Usando PNG para preservar a transparência
        "PNG",
        0,
        0,
        pageWidth,
        contentHeight,
        undefined,
        "FAST"
      );

      // Salva o PDF
      pdf.save(
        `orcamento_${patientName.replace(/\s+/g, "_").toLowerCase()}.pdf`
      );

      toast("PDF gerado com sucesso", {
        description: "O orçamento foi exportado no formato PDF.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erro na exportação", {
        description:
          "Ocorreu um erro ao exportar o orçamento. Tente novamente.",
      });
    } finally {
      set({ exporting: false });
    }
  },
}));
