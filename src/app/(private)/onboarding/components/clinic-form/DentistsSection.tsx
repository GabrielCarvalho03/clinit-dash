import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DentistItem } from "./DentistItem";
import { Dentist } from "@/@types/auth";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

interface DentistsSectionProps {
  handleAddDentist: () => void;
  handleUpdateDentist: (dentist: Dentist) => void;
  handleRemoveDentist: (id: string) => void;
}

export const DentistsSection = ({
  handleAddDentist,
  handleUpdateDentist,
  handleRemoveDentist,
}: DentistsSectionProps) => {
  const { dentists } = useAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dentistas Cadastrados</h3>
        <Button type="button" onClick={handleAddDentist} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Dentista
        </Button>
      </div>

      {dentists.length === 0 ? (
        <div className="bg-muted/50 rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum dentista cadastrado
          </p>
          <Button type="button" onClick={handleAddDentist}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Dentista
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {dentists?.map((dentist) => (
            <DentistItem
              key={dentist.id}
              dentist={dentist}
              onUpdate={handleUpdateDentist}
              onRemove={handleRemoveDentist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
