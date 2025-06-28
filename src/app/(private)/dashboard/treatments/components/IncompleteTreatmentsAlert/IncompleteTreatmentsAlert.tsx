import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { StandardTreatment } from "@/@types/quotes";

interface IncompleteTreatmentsAlertProps {
  incompleteTreatments: StandardTreatment[];
  onEdit: (treatment: StandardTreatment) => void;
}

export function IncompleteTreatmentsAlert({
  incompleteTreatments,
  onEdit,
}: IncompleteTreatmentsAlertProps) {
  if (incompleteTreatments.length === 0) return null;

  return (
    <Alert className="border-yellow-300 bg-yellow-50 w-full">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription>
        <div className="space-y-3 w-full">
          <div>
            <p className="font-medium text-yellow-800 mb-2">
              {incompleteTreatments.length} tratamento(s) importado(s) com
              informações incompletas:
            </p>

            <div className="space-y-2 w-full">
              {incompleteTreatments.map((treatment) => (
                <div
                  key={treatment.name}
                  className="flex w-full items-center justify-between bg-white p-2 rounded border"
                >
                  <div className="flex-1 w-full">
                    <span className="font-medium">{treatment.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {!treatment.description && (
                        <span className="text-red-600">
                          • Descrição ausente{" "}
                        </span>
                      )}
                      {!treatment.price && (
                        <span className="text-red-600">• Preço ausente</span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(treatment)}
                  >
                    Completar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
