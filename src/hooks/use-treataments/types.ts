import { StandardTreatment } from "@/@types/quotes";

export interface TreatamentsStore {
  buttonLoading: boolean;
  setButtonLoading: (buttonLoading: boolean) => void;

  procedures: StandardTreatment[];
  setProcedures: (procedures: StandardTreatment[]) => void;

  newProcedure: StandardTreatment;
  setNewProcedure: (newProcedure: StandardTreatment) => void;

  showForm: boolean;
  setShowForm: (showForm: boolean) => void;

  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;

  editingId: string | null;
  setEditingId: (editingId: string | null) => void;

  templateType: string;
  setTemplateType: (templateType: string) => void;

  handleSaveProcedure: (
    objtosave: StandardTreatment,
    clinicId: string
  ) => Promise<void>;
  handleGetProcedure: (id?: string) => Promise<void>;
  handleDeleteProcedure: (id: string, name: string) => void;
  handleEditProcedure: (id: any) => void;
  handleCancelProcedure: () => void;
  handleFileUploaded: (file: File, preview: string) => void;
  handleTemplateChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
