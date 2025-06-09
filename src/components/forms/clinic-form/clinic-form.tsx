import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { Dentist } from "@/@types/auth";
import { BasicInfoSection } from "../../../app/(private)/onboarding/components/clinic-form/BasicInfoSection";
import { SocialMediaSection } from "../../../app/(private)/onboarding/components/clinic-form/SocialMediaSection";
import { DentistsSection } from "../../../app/(private)/onboarding/components/clinic-form/DentistsSection";
import {
  clinicFormSchema,
  ClinicFormData,
} from "../../../app/(private)/onboarding/components/clinic-form/schema";
import { api } from "@/lib/axios/axios";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { useClinic } from "@/hooks/use-clinic/use-clinic";
import { Loader2 } from "lucide-react";
import { formatCNPJ } from "@/utils/text-formarter/cnpj-formarter";
import { formatPhone } from "@/utils/text-formarter/phone-formarter";
import { treatmentDefaultList } from "@/hooks/use-treataments/treatments-default-list";

interface ClinicFormProps {
  onFormSubmit?: () => void;
  submitButtonText?: string;
  submitButtonIcon?: React.ReactNode;
  initialActiveTab?: "clinic" | "dentists";
  showSingleView?: boolean;
}

export const ClinicForm = ({
  onFormSubmit,
  submitButtonText = "Salvar Alterações",
  submitButtonIcon,
  initialActiveTab = "clinic",
  showSingleView = false,
}: ClinicFormProps) => {
  const { clinic, setClinic, setIsLoading, isLoading } = useAuth();
  const { dentists, setDentists } = useAnalytics();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    typeof clinic?.logo === "string" ? clinic.logo : ""
  );
  const { saveIsLoading, setSaveIsLoading } = useClinic();
  const [activeTab, setActiveTab] = useState<"clinic" | "dentists">(
    initialActiveTab
  );

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: clinic?.name || "",
      address: clinic?.address || "",
      phoneNumber: formatPhone(clinic?.phoneNumber || ""),
      phoneNumber2: formatPhone(clinic?.phoneNumber2 || ""),
      cnpj: formatCNPJ(clinic?.cnpj || ""),
      socialMedia: {
        instagram: clinic?.socialMedia?.instagram || "",
        facebook: clinic?.socialMedia?.facebook || "",
        website: clinic?.socialMedia?.website || "",
      },
    },
  });

  const handleLogoUpload = (file: File, preview: string) => {
    setLogoFile(file);
    setLogoPreview(preview);
  };

  const handleAddDentist = () => {
    const newDentist: Dentist = {
      id: ``,
      name: "",
      photo: "",
      specialty: "",
    };

    let aux = [newDentist, ...dentists];

    setDentists(aux);
  };

  const handleUpdateDentist = async (updatedDentist: Dentist) => {
    const dentist = dentists.find((d) => d.id === updatedDentist.id);

    console.log("updatedDentist", dentist);
    setDentists(
      dentists.map((dentist) =>
        dentist.id === updatedDentist.id ? updatedDentist : dentist
      )
    );
    await api.post("/dentist/update", updatedDentist);
  };

  const handleRemoveDentist = async (id: string) => {
    await api.post("/dentist/delete", { id });
    setDentists(dentists.filter((dentist) => dentist.id !== id));
    toast.success("Dentista removido com sucesso");
  };

  const onSubmit = async (data: ClinicFormData) => {
    if (dentists.length === 0) {
      toast.error("Erro ao salvar perfil", {
        description: "É necessário cadastrar pelo menos um dentista",
      });

      return;
    }

    const invalidDentists = dentists.filter((d) => !d.name.trim());
    if (invalidDentists.length > 0) {
      toast.error("Erro ao salvar perfil", {
        description: "Todos os dentistas precisam ter um nome",
      });

      return;
    }

    if (!clinic) return;

    const updatedClinic = {
      ...clinic,
      ...data,
      logo: logoPreview || clinic.logo,
      dentists: dentists.map((d) => ({
        ...d,
        photo: d.photo || "",
      })),
    };

    const cleanPhone = data.phoneNumber.replace(/\D/g, "");
    const cleanCNPJ = data.cnpj.replace(/\D/g, "");
    const cleanPhone2 = data.phoneNumber2?.replace(/\D/g, "");

    const obj = {
      clinicId: clinic.id,
      id: clinic.id,
      name: updatedClinic.name,
      cnpj: cleanCNPJ,
      phone1: cleanPhone,
      phone2: cleanPhone2,
      address: updatedClinic.address,
      logo: updatedClinic.logo,
      dentist: updatedClinic.dentists,
      firstLogin: false,
      socialMedia: {
        facebook: updatedClinic.socialMedia.facebook,
        instagram: updatedClinic.socialMedia.instagram,
        website: updatedClinic.socialMedia.website,
      },
    };
    setSaveIsLoading(true);
    if (clinic.firstLogin) {
      treatmentDefaultList.map(async (treatment) => {
        await api.post("/treatments/create", {
          clinicId: clinic.id,
          name: treatment.name,
          description: treatment.description,
          image: treatment.image,
          price: treatment.price,
        });
      });
    }
    const save = await api.post("/user/update", obj);

    setSaveIsLoading(false);
    console.log("save", save);

    setClinic(updatedClinic);

    toast("Perfil atualizado com sucesso", {
      description: "As informações da clínica foram atualizadas",
    });

    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "clinic" || value === "dentists") {
      setActiveTab(value);
    }
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {showSingleView ? (
          <>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Informações da Clínica</h3>
              <BasicInfoSection
                form={form}
                logoPreview={logoPreview}
                handleLogoUpload={handleLogoUpload}
              />
              <SocialMediaSection form={form} />
            </div>

            <div className="space-y-6 pt-6 border-t">
              <DentistsSection
                handleAddDentist={handleAddDentist}
                handleUpdateDentist={handleUpdateDentist}
                handleRemoveDentist={handleRemoveDentist}
              />
            </div>
          </>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
                value="clinic"
              >
                Informações da Clínica
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
                value="dentists"
              >
                Dentistas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clinic" className="space-y-6">
              <BasicInfoSection
                form={form}
                logoPreview={logoPreview}
                handleLogoUpload={handleLogoUpload}
              />
              <SocialMediaSection form={form} />
            </TabsContent>

            <TabsContent value="dentists" className="space-y-6">
              <DentistsSection
                handleAddDentist={handleAddDentist}
                handleUpdateDentist={handleUpdateDentist}
                handleRemoveDentist={handleRemoveDentist}
              />
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end">
          <Button disabled={saveIsLoading} type="submit">
            {saveIsLoading && <Loader2 className=" h-4 w-4 animate-spin" />}
            {submitButtonText}
            {submitButtonIcon}
          </Button>
        </div>
      </form>
    </Form>
  );

  return formContent;
};
