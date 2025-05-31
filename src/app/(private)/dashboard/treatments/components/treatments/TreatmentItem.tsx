import { Treatment } from "@/@types/quotes";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TreatmentImageUpload } from "./TreatmentImageUpload";

interface TreatmentItemProps {
  index: number;
  field: {
    id: string;
  } & Partial<Treatment>;
  form: UseFormReturn<any>;
  onRemove: () => void;
  hasError: boolean;
}

export function TreatmentItem({
  index,
  field,
  form,
  onRemove,
  hasError,
}: TreatmentItemProps) {
  const [defaultImageExpanded, setDefaultImageExpanded] = useState(false);

  return (
    <Card className={`overflow-hidden ${hasError ? "border-red-500" : ""}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <FormField
            control={form.control}
            name={`treatments.${index}.name`}
            render={({ field: nameField }) => (
              <FormItem className="flex-1 mr-4">
                <FormLabel htmlFor={`treatment-name-${index}`}>
                  Nome do Tratamento
                </FormLabel>
                <FormControl>
                  <Input
                    id={`treatment-name-${index}`}
                    placeholder="Nome do tratamento"
                    {...nameField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`treatments.${index}.price`}
            render={({ field: priceField }) => (
              <FormItem className="w-32">
                <FormLabel htmlFor={`treatment-price-${index}`}>
                  Preço (R$)
                </FormLabel>
                <FormControl>
                  <Input
                    id={`treatment-price-${index}`}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0,00"
                    {...priceField}
                    onChange={(e) =>
                      priceField.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`treatments.${index}.description`}
          render={({ field: descField }) => (
            <FormItem>
              <FormLabel htmlFor={`treatment-description-${index}`}>
                Descrição
              </FormLabel>
              <FormControl>
                <Textarea
                  id={`treatment-description-${index}`}
                  placeholder="Descreva o tratamento..."
                  rows={3}
                  {...descField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remover Tratamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
