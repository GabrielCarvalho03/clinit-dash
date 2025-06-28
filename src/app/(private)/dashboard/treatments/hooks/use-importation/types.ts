import { StandardTreatment } from "@/@types/quotes";
import { boolean } from "zod";

type handleImportProps = {
  onImport: (treatments: StandardTreatment[]) => Promise<void>;
  onOpenChange: (open: boolean) => void;
};
export interface UseImportationProps {
  buttonImportationIsLoading: boolean;
  setButtonImportationIsLoading: (value: boolean) => void;

  file: File | null;
  setFile: (file: File | null) => void;

  importing: boolean;
  setImporting: (importing: boolean) => void;

  previewTreatments: StandardTreatment[];
  setPreviewTreatments: (treatments: StandardTreatment[]) => void;

  showPreview: boolean;
  setShowPreview: (showPreview: boolean) => void;

  parseCSV: (text: string) => StandardTreatment[];
  parseExcel: (file: File) => Promise<StandardTreatment[]>;
  handlePreview: () => Promise<void>;
  handleImport: ({
    onImport,
    onOpenChange,
  }: handleImportProps) => Promise<void>;

  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getTreatmentStatus(treatment: StandardTreatment): "complete" | "incomplete";
}
