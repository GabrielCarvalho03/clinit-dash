import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface QuoteValidityProps {
  form: UseFormReturn<any>;
  validityType: string;
  handleValidityTypeChange: (value: string) => void;
}

export function QuoteValidity({
  form,
  validityType,
  handleValidityTypeChange,
}: QuoteValidityProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Validade do Orçamento</FormLabel>
      <p className="text-xs text-muted-foreground mb-2">
        Define por quanto tempo a proposta é válida
      </p>

      <RadioGroup
        value={validityType}
        onValueChange={handleValidityTypeChange}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="days" id="validity-days" />
          <Label htmlFor="validity-days">Prazo em dias</Label>
          {validityType === "days" && (
            <div className="ml-8">
              <FormField
                control={form.control}
                name="validityDays"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        className="w-20"
                        placeholder=""
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <span>dias</span>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="validity-custom" />
          <Label htmlFor="validity-custom">Data específica</Label>
          {validityType === "custom" && (
            <div className="ml-8">
              <FormField
                control={form.control}
                name="validityCustomDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
