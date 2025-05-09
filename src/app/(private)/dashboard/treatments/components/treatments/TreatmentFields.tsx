import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TreatmentFieldsProps {
  index: number;
  form: UseFormReturn<any>;
}

export function TreatmentFields({ index, form }: TreatmentFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name={`treatments.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`treatments.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço (R$)</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  R$
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-10"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Informe o valor do tratamento.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
