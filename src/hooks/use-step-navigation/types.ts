import { UseFormReturn } from "react-hook-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Quote } from "@/@types/quotes";

export interface StepNavigationState {
  step: number;
  setStep: (step: number) => void;
  handleNext: (
    form: UseFormReturn<any>,
    draftQuote: Quote | null,
    setDraftQuote: (q: Quote | null) => void
  ) => void;
  handlePrevious: (
    form: UseFormReturn<any>,
    draftQuote: Quote | null,
    setDraftQuote: (q: Quote | null) => void
  ) => void;
  handleCancel: (
    isEdit: boolean,
    setDraftQuote: (q: Quote | null) => void,
    route: AppRouterInstance
  ) => void;
}
