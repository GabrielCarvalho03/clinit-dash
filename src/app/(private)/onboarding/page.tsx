"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClinicForm } from "../../../components/forms/clinic-form/clinic-form";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { getUserRefresh } from "@/utils/get-user-refresh";
const Onboarding = () => {
  const { clinic, setClinic, setIsLoading, completeOnboarding, isLoading } =
    useAuth();

  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    completeOnboarding();
    setCompleted(true);
    toast("Configuração concluída", {
      description: "Sua clínica está pronta para gerar orçamentos.",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  useEffect(() => {
    getUserRefresh(setClinic, setIsLoading);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <body className="min-h-screen flex flex-col bg-muted/30 !overflow-y-auto">
      <div className="container max-w-screen-lg mx-auto flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Configuração Inicial
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações da sua clínica para começar a utilizar o
            sistema.
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-lg p-8">
          {!completed ? (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold">
                  Dados da Clínica e Dentistas
                </h2>
                <p className="text-muted-foreground">
                  Complete as informações abaixo para configurar sua clínica e
                  adicione pelo menos um dentista.
                </p>
              </div>

              <ClinicForm
                onFormSubmit={handleComplete}
                submitButtonText="Concluir Cadastro"
                showSingleView={true}
              />
            </>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Redirecionando...</h3>
              <p className="text-muted-foreground">
                Você será redirecionado para o dashboard em instantes.
              </p>
            </div>
          )}
        </div>
      </div>
    </body>
  );
};

export default Onboarding;
