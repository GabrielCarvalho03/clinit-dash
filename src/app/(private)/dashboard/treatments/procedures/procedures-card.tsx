import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StandardTreatment } from "@/@types/quotes";
import { formatCurrency } from "@/utils/formart";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";

interface ProcedureCardProps {
  procedure: StandardTreatment;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function ProcedureCard({
  procedure,
  onEdit,
  onDelete,
}: ProcedureCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { buttonLoading } = UseTreataments();

  return (
    <Card className="overflow-hidden">
      {procedure.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={procedure.image}
            alt={procedure.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="pt-6">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-lg">{procedure.name}</h3>
          <span className="font-semibold text-primary">
            {formatCurrency(procedure.price)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {procedure.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button disabled={buttonLoading} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />{" "}
              {buttonLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Excluindo...</span>
                </div>
              ) : (
                "Excluir"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o procedimento "{procedure.name}
                "? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(procedure.id)}>
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
