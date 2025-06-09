"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { PatientStep } from "./PatientStep";
import { TreatmentStep } from "./TreatmentStep";
import { FinalizationStep } from "./FinalizationStep";
import { PreviewStep } from "./PreviewStep";
import { Quote } from "@/@types/quotes";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepsProgress } from "./StepsProgress";
import { useStepNavigation } from "@/hooks/use-step-navigation/use-step-navigation";
import { QuoteFormData, quoteSchema } from "@/hooks/use-quote/schema";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

interface QuoteStepsProps {
  isEdit?: boolean;
}

export const QuoteSteps = ({ isEdit = false }: QuoteStepsProps) => {
  const [saving, setSaving] = useState(false);
  const [hasCreatedQuote, setHasCreatedQuote] = useState(false);
  const { createQuote, updateQuote, draftQuote, setDraftQuote, quotes } =
    useQuote();
  const { dentists } = useAnalytics();
  const { clinic, user } = useAuth();
  const router = useRouter();
  console.log("isEdit", draftQuote);
  const isEditMode =
    isEdit ||
    (draftQuote && draftQuote.id && draftQuote.id.indexOf("draft-") !== 0);

  const form = useForm<QuoteFormData>({
    //@ts-ignore
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      patientName: draftQuote?.patientName || "",
      patientGender: draftQuote?.patientGender || undefined,
      patientProfile: draftQuote?.patientProfile || undefined, // padrão para perfil do paciente
      patientAge: draftQuote?.patientAge || undefined, // Isso é válido porque é opcional
      patientBirthdate: draftQuote?.patientBirthdate || undefined,
      dentistId: draftQuote?.dentistId || "",
      ageGroup: draftQuote?.ageGroup || "adult", // Definido como "adult" por padrão
      relationship: draftQuote?.relationship || undefined, // Definido como "new" por padrão
      treatments: draftQuote?.treatments || [],
      observations: draftQuote?.observations || "", // Pode ser vazio ou algum valor padrão
      gift: draftQuote?.gift || "", // Pode ser vazio ou algum valor padrão
      anchoragePercentage: draftQuote?.customOriginalPrice
        ? "custom"
        : undefined,
      downPayment: draftQuote?.downPayment || 0,
      installments: draftQuote?.installments || 1,
      paymentConditions: draftQuote?.paymentConditions || "",
      paymentPreviewText: draftQuote?.paymentPreviewText || "",
      validityDays: draftQuote?.validityDays || undefined,
      validityCustomDate: draftQuote?.validityCustomDate || undefined, // Já é opcional no schema
      illustrationImages: draftQuote?.illustrations || [],
      customOriginalPrice: draftQuote?.customOriginalPrice || undefined,
    },
  });

  const { step, handlePrevious, handleNext, handleCancel, setStep } =
    useStepNavigation();

  // Reset quote creation state when component mounts or when editing a different quote
  useEffect(() => {
    setHasCreatedQuote(false);
  }, [isEditMode, draftQuote?.id]);

  const onSubmit = async (data: QuoteFormData) => {
    if (hasCreatedQuote) {
      return;
    }

    setSaving(true);
    try {
      if (data.treatments.length === 0) {
        toast.error("Erro ao salvar orçamento", {
          description: "É necessário adicionar pelo menos um tratamento",
        });

        setSaving(false);
        return;
      }

      let finalQuote: Quote;

      console.log("chegou aqui", draftQuote);

      if (isEditMode) {
        finalQuote = {
          ...draftQuote!,
          ...data,
          illustrations: draftQuote?.illustrations || null,
          customOriginalPrice: draftQuote?.customOriginalPrice || null,
          createdAt: draftQuote?.createdAt || null,
          status: "final" as const,
        } as Quote;
        await updateQuote(finalQuote);

        form.reset(data);
      } else {
        finalQuote = {
          ...data,
          id: crypto.randomUUID(),
          dentistId: data.dentistId || user?.id || "",
          createdAt: new Date(),
          status: "final" as const,
        } as Quote;
        await createQuote(finalQuote);
        form.reset(data);
      }

      setDraftQuote(null);
      setHasCreatedQuote(true);

      if (isEdit) {
        setTimeout(() => {
          router.push("/dashboard/reports");
          setStep(1);
        }, 2000);
      }
    } catch (error) {
      toast.error("Erro ao salvar orçamento", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PatientStep form={form} />;
      case 2:
        return <TreatmentStep form={form} />;
      case 3:
        return <FinalizationStep form={form} />;
      case 4:
        return (
          <PreviewStep
            form={form}
            onSubmit={onSubmit}
            isLoading={saving}
            isEditMode={isEdit}
          />
        );
      default:
        return <PatientStep form={form} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <StepsProgress
        currentStep={step}
        onStepClick={(step: number) =>
          handleNext(form, draftQuote, setDraftQuote)
        }
      />

      <Form {...form}>
        <form
          onSubmit={
            //@ts-ignore
            form.handleSubmit(onSubmit)
          }
        >
          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePrevious(form, draftQuote, setDraftQuote)}
                className="px-6"
              >
                Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCancel(isEdit, setDraftQuote, router)}
                className="px-6"
              >
                Cancelar
              </Button>
            )}

            {step < 4 && (
              <Button
                type="button"
                onClick={() => handleNext(form, draftQuote, setDraftQuote)}
                className="px-6"
              >
                Continuar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
