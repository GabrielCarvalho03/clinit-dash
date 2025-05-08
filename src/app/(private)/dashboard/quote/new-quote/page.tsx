"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { QuoteSteps } from "../components/steps/QuoteSteps";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";

const NewQuote = () => {
  const { clinic, isLoading, setClinic, setIsLoading } = useAuth();
  const { handleGetDentists } = useAnalytics();
  const { handleGetProcedure } = UseTreataments();
  useEffect(() => {
    loadScreen();
  }, []);

  const loadScreen = async () => {
    const clinicData = await getUserRefresh(setClinic, setIsLoading);

    Promise.all([
      handleGetDentists(clinicData?.id || ""),
      handleGetProcedure(clinicData?.id || ""),
    ]);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Orçamento</h1>
        <p className="text-muted-foreground">
          Crie um orçamento personalizado e persuasivo em poucos minutos.
        </p>
      </div>

      <QuoteSteps />
    </div>
  );
};

export default NewQuote;
