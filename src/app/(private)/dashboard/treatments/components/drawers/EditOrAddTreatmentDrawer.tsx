import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { StandardTreatment } from "@/@types/quotes";
import { formatCurrency } from "@/utils/formart";
import { CustomTreatmentForm } from "@/app/(private)/dashboard/treatments/components/treatments/CustomTreatmentForm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DESCRIPTION_TEMPLATES } from "../../hooks/use-treataments/description_telmplates";
import { FileUpload } from "@/components/file-upload/file-upload";
import { UseTreataments } from "../../hooks/use-treataments/use-treataments";

interface TreatmentDrawerProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  disabled?: boolean;
  isEdit?: boolean;
}

export function EditOrAddTreatmentDrawer({
  isOpen,
  setIsOpen,
  disabled,
  isEdit,
}: TreatmentDrawerProps) {
  const {
    newProcedure,
    searchTerm,
    editingId,
    templateType,
    buttonLoading,
    setNewProcedure,
    handleTemplateChange,
    handleCancelProcedure,
    handleSubmit,
    setImageIlustration,
  } = UseTreataments();
  const handleAddIllustration = (file: File, preview: string) => {
    const newIllustration = { url: preview, type: "illustration" };

    setImageIlustration({
      url: newIllustration.url,
      type: newIllustration.type,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar" : "Adicionar"} Tratamentos</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Edite um tratamento existente na tabela."
              : "Crie um tratamento personalizado e adicione a tabela."}
          </SheetDescription>
        </SheetHeader>

        <section className="mt-6 space-y-4 px-2 relative h-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
            <div>
              <Label htmlFor="name" className="mb-2">
                Nome do Tratamento
              </Label>
              <Input
                placeholder="Nome do Tratamento"
                value={newProcedure.name}
                onChange={(e) =>
                  setNewProcedure({ ...newProcedure, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="name" className="mb-2">
                Preço
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0,00"
                value={newProcedure.price}
                onChange={(e) =>
                  setNewProcedure({
                    ...newProcedure,
                    price: Number(e.target.value),
                  })
                }
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="description-template" className="mb-2">
                Tipo de Tratamento
              </Label>
              <Select value={templateType} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo de tratamento" />
                </SelectTrigger>
                <SelectContent>
                  {DESCRIPTION_TEMPLATES.map((template) => (
                    <SelectItem key={template.label} value={template.label}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name" className="mb-2">
                Descrição do Tratamento
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva o tratamento..."
                rows={3}
                value={newProcedure.description}
                onChange={(e) =>
                  setNewProcedure({
                    ...newProcedure,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="name" className="mb-2">
                Imagem do Tratamento (opcional)
              </Label>

              <FileUpload
                label=""
                onFileUploaded={handleAddIllustration}
                initialPreview={newProcedure.photo}
                onClear={() =>
                  setImageIlustration({
                    url: "",
                    type: "",
                  })
                }
                compact={true}
              />
            </div>

            <footer className="absolute bottom-5  w-full pr-5">
              <div className="flex justify-between space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelProcedure}
                >
                  Cancelar
                </Button>
                <Button disabled={buttonLoading} type="submit">
                  {buttonLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>
                        {editingId ? "Atualizando" : "Adicionando"}{" "}
                        Tratamento...
                      </span>
                    </div>
                  ) : (
                    <>{editingId ? "Atualizar" : "Adicionar"} Tratamento</>
                  )}
                </Button>
              </div>
            </footer>
          </form>
        </section>
      </SheetContent>
    </Sheet>
  );
}
