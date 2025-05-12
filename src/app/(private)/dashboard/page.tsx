"use client";

import { Button } from "@/components/ui/button";
import { DashboardSummary } from "@/app/(private)/dashboard/components/DashboardSummary/dashboardSummary";
import { RecentQuotes } from "@/app/(private)/dashboard/components/recentQuotes/recentQuotes";
import { AlertCircle, Plus, UserCog } from "lucide-react";
import { useAuth } from "@/hooks/use-auth/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

const Dashboard = () => {
  const {
    clinic,
    needsOnboarding,
    isLoading,
    setClinic,
    setIsLoading,
    setNeedsOnboarding,
  } = useAuth();
  const { handleGetDentists, dentists } = useAnalytics();

  useEffect(() => {
    if (!clinic?.id || !dentists.length) loadScreen();
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

  return (
    <div className="my-6 px-7">
      <div className="flex justify-between items-center pb-2 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo {clinic?.name ? `à ${clinic.name}` : ""}!
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 rounded-lg">
          <a href="/quote/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </a>
        </Button>
      </div>

      {needsOnboarding && (
        <Card className="border-amber-200 bg-amber-50 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Complete seu cadastro
            </CardTitle>
            <CardDescription className="text-amber-700">
              Para utilizar todas as funcionalidades do sistema, é necessário
              completar o cadastro da sua clínica.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>Adicione informações importantes como:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Dados de contato e endereço da clínica</li>
              <li>Logo da clínica (aparecerá nos orçamentos)</li>
              <li>Cadastro dos dentistas</li>
              <li>Informações complementares</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="default"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <a href="/profile" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Completar Cadastro
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="border-none shadow-sm bg-[#F1F0FB]/50">
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-[#D6BCFA]/20 w-full justify-start p-1 rounded-none border-b">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
              >
                Análise de Desempenho
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="overview" className="space-y-6 mt-2">
                <DashboardSummary />
                <RecentQuotes />
              </TabsContent>

              <TabsContent value="analytics" className="mt-2">
                <AnalyticsDashboard />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
