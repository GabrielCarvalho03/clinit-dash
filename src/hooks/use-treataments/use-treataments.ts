import { create } from "zustand";
import { TreatamentsStore } from "./types";
import { useQuote } from "../use-cotes/use-cotes";
import { toast } from "sonner";
import { DESCRIPTION_TEMPLATES } from "./description_telmplates";
import { api } from "@/lib/axios/axios";
import { useAuth } from "../use-auth/use-auth";

export const UseTreataments = create<TreatamentsStore>((set) => ({
  buttonLoading: false,
  setButtonLoading: (buttonLoading) => set({ buttonLoading }),

  editingId: null,
  setEditingId: (editingId) => set({ editingId }),

  templateType: "",
  setTemplateType: (templateType) => set({ templateType }),

  procedures: [],
  setProcedures: (procedures) => set({ procedures }),

  newProcedure: {
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
  },
  setNewProcedure: (newProcedure) => set({ newProcedure }),
  showForm: false,
  setShowForm: (showForm) => set({ showForm }),
  searchTerm: "",
  setSearchTerm: (searchTerm) => set({ searchTerm }),

  handleGetProcedure: async (id) => {
    const { setProcedures } = UseTreataments.getState();
    const { setIsLoading } = useAuth.getState();
    try {
      setIsLoading(true);
      const res = await api.post("/treatments/get-by-clinic", {
        clinicId: id,
      });
      console.log("res", res.data);
      setProcedures(res.data);
    } catch (error) {
      console.error("Error loading procedimentos:", error);
      toast.error("Erro ao carregar tratamentos", {
        description: "Nao foi possivel carregar os tratamentos salvos.",
      });
    } finally {
      setIsLoading(false);
    }
  },

  handleSaveProcedure: async (objtosave, clinicId) => {
    const { procedures, setProcedures, newProcedure } =
      UseTreataments.getState();
    const { addCustomTreatment } = useQuote.getState();

    const newObjtosave = { ...objtosave, clinicId };
    try {
      const res = await api.post("/treatments/create", newObjtosave);

      const newObjtoProcedures = { ...objtosave, id: res.data.id };
      setProcedures([...procedures, newObjtoProcedures]);
      addCustomTreatment(newObjtoProcedures);
      toast("Tratamento adicionado", {
        description: `${newProcedure.name} foi adicionado com sucesso.`,
      });
      console.log("procedures", objtosave);
    } catch (error) {
      console.error("Error saving tratamentos:", error);
      toast.error("Erro ao salvar tratamentos", {
        description: "Não foi possível salvar os tratamentos.",
      });
    }
  },

  handleDeleteProcedure: async (id: string, name: string) => {
    const { setButtonLoading } = UseTreataments.getState();
    try {
      setButtonLoading(true);
      console.log("deletando", id);
      await api.post("/treatments/delete", { id });

      toast("Tratamento excluído", {
        description: `${name} foi excluído com sucesso.`,
      });
      const { procedures, setProcedures } = UseTreataments.getState();
      const filteredProcedures = procedures.filter((p) => p.id !== id);
      setProcedures(filteredProcedures);
    } catch (error) {
      console.error("Error deleting tratamentos:", error);
      toast.error("Erro ao excluir tratamentos", {
        description: "Não foi possível excluir os tratamentos.",
      });
    } finally {
      setButtonLoading(false);
    }
  },

  handleEditProcedure: async (procedure) => {
    const { setNewProcedure, setEditingId, setShowForm } =
      UseTreataments.getState();

    setNewProcedure({
      id: procedure.id,
      name: procedure.name,
      description: procedure.description,
      price: Number(procedure.price) || 0,
      image: procedure.image || "",
    });
    setEditingId(procedure.id);
    setShowForm(true);
  },

  handleCancelProcedure: () => {
    const { setNewProcedure, setEditingId, setShowForm } =
      UseTreataments.getState();
    setNewProcedure({
      id: "",
      name: "",
      description: "",
      price: 0,
      image: "",
    });
    setEditingId(null);
    setShowForm(false);
  },

  handleFileUploaded: (file: File, preview: string) => {
    const { setNewProcedure, newProcedure } = UseTreataments.getState();
    setNewProcedure({ ...newProcedure, image: preview });
  },

  handleTemplateChange: (value: string) => {
    const { setTemplateType, setNewProcedure, newProcedure } =
      UseTreataments.getState();
    setTemplateType(value);
    const template = DESCRIPTION_TEMPLATES.find((t) => t.label === value);
    if (template) {
      if (value === "Personalizado") {
        setNewProcedure({
          ...newProcedure,
          description: "",
        });
      } else {
        setNewProcedure({
          ...newProcedure,
          description: template.value,
        });
      }
    }
  },

  handleSubmit: async (e: React.FormEvent) => {
    const {
      procedures,
      newProcedure,
      editingId,
      setProcedures,
      setNewProcedure,
      setShowForm,
      setEditingId,
      handleSaveProcedure,
      setButtonLoading,
    } = UseTreataments.getState();
    const { clinic } = useAuth.getState();

    const { addCustomTreatment } = useQuote.getState();

    e.preventDefault();

    if (!newProcedure.name.trim()) {
      toast.error("Nome obrigatório", {
        description: "O nome do tratamento é obrigatório.",
      });
      return;
    }
    const procedureToSave = {
      ...newProcedure,
      price: Number(newProcedure.price) || 0,
    };
    setButtonLoading(true);

    if (editingId) {
      await api.post("/treatments/update", procedureToSave);
      const updatedProcedures = procedures.map((p) =>
        p.id === editingId ? procedureToSave : p
      );
      setProcedures(updatedProcedures);
      addCustomTreatment(procedureToSave);
      toast("Tratamento atualizado", {
        description: `${newProcedure.name} foi atualizado com sucesso.`,
      });
      setEditingId(null);
    } else {
      await handleSaveProcedure(procedureToSave, clinic?.id || "");
    }
    setButtonLoading(false);
    setNewProcedure({
      id: "",
      name: "",
      description: "",
      price: 0,
      image: "",
    });
    setShowForm(false);
  },
}));
