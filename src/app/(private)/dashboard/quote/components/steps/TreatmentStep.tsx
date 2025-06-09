import { useFieldArray } from "react-hook-form";
import { Info } from "lucide-react";
import { TreatmentList } from "@/app/(private)/dashboard/treatments/components/treatments/TreatmentList";
import { useTreatmentForm } from "@/hooks/use-treatment-form/use-treatment-form";
import { Form } from "@/components/ui/form";
import { AvailableTreatmentsAccordion } from "@/app/(private)/dashboard/quote/components/treatment/AvailableTreatmentsAccordion";
import { ObservationsField } from "@/app/(private)/dashboard/quote/components/treatment/ObservationsField";
import { useState } from "react";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreatmentDrawer } from "../TreatmentDrawer/TreatmentDrawer";
import { IllustrationsUpload } from "../IllustrationsUpload/IllustrationsUpload";

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

  const handleAddTreatment = (treatment: any) => {
    handleAddStandardTreatment(treatment, append);
  };
  const handleAddCustom = () => {
    handleAddCustomTreatment(append);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Tratamentos</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Adicione todos os tratamentos necessários para o orçamento do
          paciente.
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

      <TreatmentDrawer
        treatments={procedures}
        onAdd={handleAddTreatment}
        disabled={false}
        showCustomForm={showCustomForm}
        setShowCustomForm={setShowCustomForm}
        customTreatment={customTreatment}
        setCustomTreatment={setCustomTreatment}
        onAddCustom={handleAddCustom}
      />

      <IllustrationsUpload form={form} />

      <ObservationsField form={form} />

      <div className="bg-muted/50 border rounded-md p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> É necessário adicionar pelo menos um tratamento
          e informar o preço para cada um deles.
        </p>
      </div>
    </div>
  );
}
