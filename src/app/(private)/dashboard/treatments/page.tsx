"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpAZ, ArrowDownAZ, Plus, Search, Upload } from "lucide-react";
import { UseTreataments } from "./hooks/use-treataments/use-treataments";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { ImportTreatmentsDialog } from "./dialogs/ImportTreatmentsDialog";
import { TreatmentTable } from "./components/TreatmentTable";
import { EditOrAddTreatmentDrawer } from "./components/drawers/EditOrAddTreatmentDrawer";
import { StandardTreatment } from "@/@types/quotes";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { UseImportation } from "./hooks/use-importation/use-importation";
import { IncompleteTreatmentsAlert } from "./components/IncompleteTreatmentsAlert/IncompleteTreatmentsAlert";

export default function Treataments() {
  const {
    procedures,
    showForm,
    searchTerm,
    editingId,
    buttonLoading,
    incompleteTreatments,
    setShowForm,
    setSearchTerm,
    handleGetProcedure,
    handleEditProcedure,
    handleDeleteProcedure,
    setEditingId,
    setProcedures,
    handleSaveProcedure,
  } = UseTreataments();
  const { setButtonImportationIsLoading } = UseImportation();
  const { clinic, setClinic, setIsLoading, isLoading } = useAuth();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showImportDialog, setShowImportDialog] = useState(false);
  useEffect(() => {
    if (!clinic?.id || !procedures.length) {
      loadScreen();
    }
  }, []);

  const loadScreen = async () => {
    const clinicData = await getUserRefresh(setClinic, setIsLoading);
    await handleGetProcedure(clinicData?.id || "");
  };

  const handleImportTreatments = async (
    importedTreatments: StandardTreatment[]
  ) => {
    const newProcedures = [...procedures];
    setButtonImportationIsLoading(true);
    for (const treatment of importedTreatments) {
      const newObjtoProcedures = await handleSaveProcedure(
        treatment,
        clinic?.id || ""
      );

      newProcedures.push(
        newObjtoProcedures ?? {
          id: "",
          description: "",
          name: "",
          price: 0,
        }
      );
    }

    setProcedures(newProcedures);
    setButtonImportationIsLoading(false);
  };

  const incompleteTreatmentsList = procedures.filter(
    (treatment) => !treatment.price || !treatment.description
  );

  const filteredProcedures = procedures
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tratamentos</h1>
        <p className="text-muted-foreground">
          Gerencie os tratamentos padrão e seus preços para uso nos orçamentos.
        </p>
      </div>

      <IncompleteTreatmentsAlert
        incompleteTreatments={incompleteTreatmentsList}
        onEdit={handleEditProcedure}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar tratamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex-shrink-0"
          >
            {sortOrder === "asc" ? (
              <ArrowDownAZ className="h-4 w-4" />
            ) : (
              <ArrowUpAZ className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            className="flex-1 sm:flex-none"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          {!showForm && (
            <Button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex-1 sm:flex-none"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Tratamento
            </Button>
          )}
        </div>
      </div>

      <TreatmentTable
        treatments={filteredProcedures}
        onEdit={handleEditProcedure}
        onDelete={handleDeleteProcedure}
        isLoading={buttonLoading}
      />

      <ImportTreatmentsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportTreatments}
      />

      <EditOrAddTreatmentDrawer
        isOpen={showForm}
        setIsOpen={setShowForm}
        isEdit={editingId ? true : false}
      />
    </div>
  );
}
