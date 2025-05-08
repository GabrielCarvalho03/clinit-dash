import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface TreatmentHeaderProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
}

export function TreatmentHeader({
  index,
  form,
  onRemove,
}: TreatmentHeaderProps) {
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-base">
          {form.getValues(`treatments.${index}.name`)}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}
