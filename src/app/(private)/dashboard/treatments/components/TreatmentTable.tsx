import { useState } from "react";
import { StandardTreatment } from "@/@types/quotes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formart";

interface TreatmentTableProps {
  treatments: StandardTreatment[];
  onEdit: (treatment: StandardTreatment) => void;
  onDelete: (id: string, name: string) => void;
  incompleteItems?: string[];
  isLoading?: boolean;
}

export function TreatmentTable({
  treatments,
  onEdit,
  onDelete,
  isLoading = false,
  incompleteItems = [],
}: TreatmentTableProps) {
  if (treatments.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Nenhum tratamento cadastrado. Adicione seu primeiro tratamento!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Tratamento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatments.map((treatment) => {
            const isIncomplete = !treatment.description || !treatment.price;
            return (
              <TableRow
                key={treatment.name}
                className={isIncomplete ? "bg-yellow-50 border-yellow-200" : ""}
              >
                <TableCell className="font-medium">
                  {treatment.name}
                  {isIncomplete && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300"
                    >
                      Incompleto
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {treatment.description || "Sem descrição"}
                  </p>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {treatment.price
                    ? formatCurrency(treatment.price)
                    : "Sem preço"}
                </TableCell>
                <TableCell>
                  <Badge variant={isIncomplete ? "destructive" : "secondary"}>
                    {isIncomplete ? "Pendente" : "Completo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(treatment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(treatment.id, treatment.name)}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
