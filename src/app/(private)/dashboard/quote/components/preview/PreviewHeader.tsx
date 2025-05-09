import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PreviewHeaderProps {
  onExportClick?: () => void;
  missingImages: string[];
  validityDate?: Date;
}

export function PreviewHeader({
  onExportClick,
  missingImages,
  validityDate,
}: PreviewHeaderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            Pré-visualização do orçamento
          </h2>
          <p className="text-muted-foreground">
            Revise o orçamento antes de salvar e exportar
          </p>
        </div>
        {onExportClick && (
          <Button
            variant="outline"
            onClick={() => onExportClick()}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Exportar
          </Button>
        )}
      </div>

      {validityDate && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            ⏳ Validade do orçamento:{" "}
            {format(validityDate, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
      )}

      {missingImages.length > 0 && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-700">Atenção</AlertTitle>
          <AlertDescription className="text-yellow-600">
            Para um orçamento com melhor apresentação, adicione{" "}
            {missingImages.join(" e ")} no seu perfil.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
