import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TreatmentList } from "@/app/(private)/dashboard/treatments/components/treatments/TreatmentList";
import { CustomTreatmentForm } from "@/app/(private)/dashboard/treatments/components/treatments/CustomTreatmentForm";
import { useTreatmentForm } from "@/hooks/use-treatment-form/use-treatment-form";
import { Form } from "@/components/ui/form";
import { AvailableTreatmentsAccordion } from "@/app/(private)/dashboard/quote/components/treatment/AvailableTreatmentsAccordion";
import { ObservationsField } from "@/app/(private)/dashboard/quote/components/treatment/ObservationsField";
import { useState } from "react";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";

export function TreatmentStep({ form }: any) {
  const { procedures } = UseTreataments();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "treatments",
  });

  const {
    standardTreatments,
    showCustomForm,
    setShowCustomForm,
    customTreatment,
    setCustomTreatment,
    priceError,
    handleAddStandardTreatment,
    handleAddCustomTreatment,
  } = useTreatmentForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Tratamentos</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Adicione os tratamentos que compõem este orçamento.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Tratamentos do Orçamento</h3>
        <Form {...form}>
          <TreatmentList
            fields={fields}
            form={form}
            remove={remove}
            priceError={priceError}
          />
        </Form>
      </div>

      {/* Adicionar observações aqui */}
      <ObservationsField form={form} />

      {/* Treatments Available - grouped in an accordion with search */}
      <AvailableTreatmentsAccordion
        treatments={procedures}
        onAdd={(data) => handleAddStandardTreatment(data, append)}
      />

      {/* Custom Treatment Form Toggle */}
      {showCustomForm ? (
        <CustomTreatmentForm
          customTreatment={customTreatment}
          setCustomTreatment={setCustomTreatment}
          onCancel={() => setShowCustomForm(false)}
          onAdd={() => handleAddCustomTreatment(append)}
        />
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowCustomForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tratamento Personalizado
        </Button>
      )}

      {/* Single hint message */}
      <div className="bg-muted/50 border rounded-md p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> É necessário adicionar pelo menos um tratamento
          e informar o preço para cada um deles.
        </p>
      </div>
    </div>
  );
}
