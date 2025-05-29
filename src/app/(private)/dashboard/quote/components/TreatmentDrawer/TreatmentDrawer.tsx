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

interface TreatmentDrawerProps {
  treatments: StandardTreatment[];
  onAdd: (treatment: StandardTreatment) => void;
  disabled?: boolean;
  showCustomForm?: boolean;
  setShowCustomForm?: (show: boolean) => void;
  customTreatment?: any;
  setCustomTreatment?: (treatment: any) => void;
  onAddCustom?: () => void;
}

export function TreatmentDrawer({
  treatments,
  onAdd,
  disabled = false,
  showCustomForm,
  setShowCustomForm,
  customTreatment,
  setCustomTreatment,
  onAddCustom,
}: TreatmentDrawerProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTreatment = (treatment: StandardTreatment) => {
    onAdd(treatment);
    setIsOpen(false);
  };

  const handleAddCustomTreatment = () => {
    if (onAddCustom) {
      onAddCustom();
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tratamentos ao Orçamento
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar Tratamentos</SheetTitle>
          <SheetDescription>
            Busque na sua tabela ou crie um tratamento personalizado.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tratamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>

          <div className="space-y-2 max-h-[40vh] overflow-y-auto">
            {filteredTreatments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum tratamento encontrado.</p>
              </div>
            ) : (
              filteredTreatments.map((treatment, index) => (
                <div
                  key={treatment.name}
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                    disabled ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {treatment.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {treatment.description}
                    </p>
                    <span className="text-sm font-medium text-primary mt-1 block">
                      {formatCurrency(treatment.price)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 flex-shrink-0"
                    disabled={disabled}
                    onClick={() => !disabled && handleAddTreatment(treatment)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">
              Ou crie um tratamento personalizado
            </h4>

            {showCustomForm &&
            setShowCustomForm &&
            customTreatment &&
            setCustomTreatment ? (
              <CustomTreatmentForm
                customTreatment={customTreatment}
                setCustomTreatment={setCustomTreatment}
                onCancel={() => setShowCustomForm(false)}
                onAdd={handleAddCustomTreatment}
                //@ts-ignore
                disabled={disabled}
              />
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowCustomForm && setShowCustomForm(true)}
                disabled={disabled}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Tratamento Personalizado
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
