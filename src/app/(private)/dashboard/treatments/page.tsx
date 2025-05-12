"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload/file-upload";
import { ProcedureCard } from "./procedures/procedures-card";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";
import { DESCRIPTION_TEMPLATES } from "@/hooks/use-treataments/description_telmplates";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";

export default function Treataments() {
  const {
    procedures,
    newProcedure,
    showForm,
    searchTerm,
    editingId,
    templateType,
    buttonLoading,
    setNewProcedure,
    setShowForm,
    setSearchTerm,
    handleGetProcedure,
    handleEditProcedure,
    handleDeleteProcedure,
    handleTemplateChange,
    handleFileUploaded,
    handleCancelProcedure,
    handleSubmit,
  } = UseTreataments();
  const { clinic, setClinic, setIsLoading, isLoading } = useAuth();
  console.log("clinic", clinic);

  useEffect(() => {
    if (!clinic?.id || !procedures.length) {
      loadScreen();
    }
  }, []);

  const loadScreen = async () => {
    const clinicData = await getUserRefresh(setClinic, setIsLoading);
    await handleGetProcedure(clinicData?.id || "");
  };

  const filteredProcedures = procedures.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold tracking-tight">Tratamentos</h1>
        <p className="text-muted-foreground">
          Gerencie os tratamentos padrão e seus preços para uso nos orçamentos.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar tratamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Tratamento
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Novo"} Tratamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Tratamento</Label>
                  <Input
                    id="name"
                    value={newProcedure.name}
                    onChange={(e) =>
                      setNewProcedure({ ...newProcedure, name: e.target.value })
                    }
                    placeholder="Ex: Clareamento Dental"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço Padrão (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProcedure.price}
                    onChange={(e) =>
                      setNewProcedure({
                        ...newProcedure,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description-template">Tipo de Tratamento</Label>
                <Select
                  value={templateType}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de tratamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESCRIPTION_TEMPLATES.map((template) => (
                      <SelectItem key={template.label} value={template.label}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Tratamento</Label>
                <Textarea
                  id="description"
                  value={newProcedure.description}
                  onChange={(e) =>
                    setNewProcedure({
                      ...newProcedure,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreva o tratamento..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelProcedure}
                >
                  Cancelar
                </Button>
                <Button disabled={buttonLoading} type="submit">
                  {buttonLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>
                        {editingId ? "Atualizando" : "Adicionando"}{" "}
                        Tratamento...
                      </span>
                    </div>
                  ) : (
                    <>{editingId ? "Atualizar" : "Adicionar"} Tratamento</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcedures.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-md bg-muted/20">
            {searchTerm ? (
              <p>Nenhum tratamento encontrado com "{searchTerm}"</p>
            ) : (
              <p>
                Nenhum tratamento cadastrado. Adicione seu primeiro tratamento!
              </p>
            )}
          </div>
        ) : (
          filteredProcedures.map((procedure) => (
            <ProcedureCard
              key={procedure.name}
              procedure={procedure}
              onEdit={() => handleEditProcedure(procedure)}
              onDelete={() =>
                handleDeleteProcedure(procedure.id, procedure.name)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
