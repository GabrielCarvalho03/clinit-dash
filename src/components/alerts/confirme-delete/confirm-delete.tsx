import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

type ConfirmDeleteProps = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  title?: string;
  description?: string;
};

// Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
export const ConfirmeDeleteAlert = ({
  deleteDialogOpen,
  title,
  description,
  setDeleteDialogOpen,
  confirmDelete,
}: ConfirmDeleteProps) => {
  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? "Confirmar exclusão"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
