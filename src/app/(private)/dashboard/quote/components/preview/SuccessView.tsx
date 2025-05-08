import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./ExportDialog";
import { useEffect } from "react";

interface SuccessViewProps {
  message: string;
  showExportOptions: boolean;
  setShowExportOptions: (show: boolean) => void;
  onExport: (
    type:
      | "pdf-images"
      | "pdf-no-images"
      | "print-images"
      | "print-no-images"
      | "word"
  ) => void;
  onFinish: () => void;
}

export const SuccessView = ({
  message,
  showExportOptions,
  setShowExportOptions,
  onExport,
  onFinish,
}: SuccessViewProps) => {
  // Automatically show export options when component mounts
  useEffect(() => {
    setShowExportOptions(true);
  }, [setShowExportOptions]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Alert className="bg-green-50 border-green-200 mb-6">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
        <AlertDescription className="text-green-700">
          {message}
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setShowExportOptions(true)}
          className="px-6"
        >
          Exportar / Imprimir
        </Button>

        <Button onClick={onFinish} className="px-6">
          Voltar para o Dashboard
        </Button>
      </div>

      <ExportDialog
        open={showExportOptions}
        onOpenChange={setShowExportOptions}
        onExport={onExport}
      />
    </div>
  );
};
