import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { StandardTreatment } from "@/@types/quotes";
import { UseImportation } from "../hooks/use-importation/use-importation";

interface ImportTreatmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (treatments: StandardTreatment[]) => Promise<void>;
}

export function ImportTreatmentsDialog({
  open,
  onOpenChange,
  onImport,
}: ImportTreatmentsDialogProps) {
  const {
    buttonImportationIsLoading,
    file,
    importing,
    previewTreatments,
    showPreview,
    handlePreview,
    handleImport,
    handleFileChange,
    getTreatmentStatus,
  } = UseImportation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Importar Tratamentos</DialogTitle>
          <DialogDescription>
            Importe tratamentos de um arquivo CSV ou Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Selecionar arquivo</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              {file.type.includes("csv") || file.name.endsWith(".csv") ? (
                <FileSpreadsheet className="h-4 w-4" />
              ) : file.type.includes("sheet") ||
                file.name.endsWith(".xlsx") ||
                file.name.endsWith(".xls") ? (
                <FileSpreadsheet className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span className="text-sm">{file.name}</span>
            </div>
          )}

          {showPreview && previewTreatments.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">
                Prévia dos tratamentos ({previewTreatments.length} encontrados)
              </h4>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {previewTreatments.map((treatment, index) => {
                  const status = getTreatmentStatus(treatment);
                  return (
                    <div
                      key={index}
                      className={`p-3 border-b last:border-b-0 ${
                        status === "incomplete" ? "bg-yellow-50" : "bg-green-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {treatment.name}
                            </span>
                            {status === "complete" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>
                              Descrição:{" "}
                              {treatment.description || "Não informada"}
                            </p>
                            <p>
                              Preço:{" "}
                              {treatment.price
                                ? `R$ ${treatment.price.toFixed(2)}`
                                : "Não informado"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {
                      previewTreatments.filter(
                        (t) => getTreatmentStatus(t) === "complete"
                      ).length
                    }{" "}
                    completos
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    {
                      previewTreatments.filter(
                        (t) => getTreatmentStatus(t) === "incomplete"
                      ).length
                    }{" "}
                    pendentes
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Formato esperado:</p>
            <p className="font-mono text-xs bg-muted p-2 rounded">
              Nome do Tratamento, Descrição, Preço
              <br />
              Clareamento Dental, Tratamento para clarear os dentes, 500.00
              <br />
              Limpeza, Profilaxia dental, 120.00
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {!showPreview ? (
            <Button onClick={handlePreview} disabled={!file || importing}>
              {importing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Analisando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analisar Arquivo
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={buttonImportationIsLoading}
              onClick={() => handleImport({ onImport, onOpenChange })}
            >
              {buttonImportationIsLoading && (
                <>
                  <span>importando</span>
                  <Loader2 className="animate-spin h-4 w-4" />
                </>
              )}
              {!buttonImportationIsLoading && <span>Confirmar Importação</span>}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
