"use client";

import { ClinicForm } from "@/components/forms/clinic-form/clinic-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { useEffect } from "react";

export default function Profile() {
  const { clinic, setClinic, isLoading, setIsLoading, setNeedsOnboarding } =
    useAuth();
  const { handleGetDentists } = useAnalytics();

  useEffect(() => {
    if (!clinic?.id) loadScreen();
  }, []);

  const loadScreen = async () => {
    setNeedsOnboarding(false);
    const clinicData = await getUserRefresh(setClinic, setIsLoading);
    handleGetDentists(clinicData?.id || "");
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil da Clínica</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da sua clínica e dentistas vinculados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Clínica</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicForm />
        </CardContent>
      </Card>
    </div>
  );
}
