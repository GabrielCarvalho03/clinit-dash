import { create } from "zustand";
import { UseImportationProps } from "./types";
import { StandardTreatment } from "@/@types/quotes";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export const UseImportation = create<UseImportationProps>((set) => ({
  buttonImportationIsLoading: false,
  setButtonImportationIsLoading: (buttonImportationIsLoading) =>
    set({ buttonImportationIsLoading }),

  file: null,
  setFile: (file) => set({ file }),

  importing: false,
  setImporting: (importing) => set({ importing }),

  previewTreatments: [],
  setPreviewTreatments: (previewTreatments) => set({ previewTreatments }),

  showPreview: false,
  setShowPreview: (showPreview) => set({ showPreview }),

  parseCSV: (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const treatments: StandardTreatment[] = [];

    // Skip header if it exists
    const startIndex =
      lines[0].toLowerCase().includes("nome") ||
      lines[0].toLowerCase().includes("tratamento")
        ? 1
        : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const columns = lines[i]
        .split(",")
        .map((col) => col.trim().replace(/"/g, ""));

      if (columns.length >= 1 && columns[0]) {
        const treatment: StandardTreatment = {
          id: "",
          name: columns[0],
          description: columns[1] || "",
          price:
            parseFloat(columns[2]?.replace(/[^\d.,]/g, "").replace(",", ".")) ||
            0,
          image: "",
        };
        treatments.push(treatment);
      }
    }

    return treatments;
  },

  parseExcel: async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const treatments: StandardTreatment[] = [];
          const startIndex =
            jsonData.length > 0 &&
            (jsonData[0] as any[]).some(
              (cell: any) =>
                typeof cell === "string" &&
                (cell.toLowerCase().includes("nome") ||
                  cell.toLowerCase().includes("tratamento"))
            )
              ? 1
              : 0;

          for (let i = startIndex; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row[0]) {
              const treatment: StandardTreatment = {
                id: "",
                name: String(row[0] || "").trim(),
                description: String(row[1] || "").trim(),
                price:
                  parseFloat(
                    String(row[2] || "0")
                      .replace(/[^\d.,]/g, "")
                      .replace(",", ".")
                  ) || 0,
                image: "",
              };
              if (treatment.name) {
                treatments.push(treatment);
              }
            }
          }

          resolve(treatments);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },
  handlePreview: async () => {
    const {
      file,
      setImporting,
      parseCSV,
      parseExcel,
      setPreviewTreatments,
      setShowPreview,
    } = UseImportation.getState();
    if (!file) return;

    setImporting(true);

    try {
      let treatments: StandardTreatment[] = [];

      if (file.type.includes("csv") || file.name.endsWith(".csv")) {
        const text = await file.text();
        treatments = parseCSV(text);
      } else if (
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.type.includes("sheet")
      ) {
        treatments = await parseExcel(file);
      } else {
        toast.error("Formato ainda não suportado.", {
          description:
            "Por enquanto, apenas arquivos CSV e Excel são suportados.",
        });
        setImporting(false);
        return;
      }

      if (treatments.length === 0) {
        toast.error("Nenhum tratamento encontrado no arquivo.", {
          description: "Verifique se o arquivo está no formato correto.",
        });
        setImporting(false);
        return;
      }

      setPreviewTreatments(treatments);
      setShowPreview(true);
    } catch (error) {
      toast.error("Erro na leitura do arquivo.", {
        description: "Não foi possível ler o arquivo. Verifique o formato.",
      });
    } finally {
      setImporting(false);
    }
  },
  handleImport: async ({ onImport, onOpenChange }) => {
    const { setPreviewTreatments, setShowPreview, setFile, previewTreatments } =
      UseImportation.getState();
    await onImport(previewTreatments);
    onOpenChange(false);
    setFile(null);
    setShowPreview(false);
    setPreviewTreatments([]);

    const completeCount = previewTreatments.filter(
      (t) => t.description && t.price
    ).length;
    const incompleteCount = previewTreatments.length - completeCount;

    toast.success("Tratamentos importados", {
      description: `${previewTreatments.length} tratamentos importados. ${completeCount} completos, ${incompleteCount} pendentes.`,
    });
  },

  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const { setPreviewTreatments, setShowPreview, setFile, previewTreatments } =
      UseImportation.getState();
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (
        allowedTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith(".csv") ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        setFile(selectedFile);
        setShowPreview(false);
        setPreviewTreatments([]);
      } else {
        toast.error("Formato de arquivo não suportado.", {
          description: "Por favor, selecione um arquivo CSV, Excel ou Word.",
        });
      }
    }
  },
  getTreatmentStatus(treatment: StandardTreatment) {
    const { description, price } = treatment;
    return description && price ? "complete" : "incomplete";
  },
}));
