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
import { getUserRefresh } from "@/utils/get-user-refresh";
import { api } from "@/lib/axios/axios";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

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
  const [activeTab, setActiveTab] = useState<"clinic" | "dentists">(
    initialActiveTab
  );

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: clinic?.name || "",
      address: clinic?.address || "",
      phoneNumber: clinic?.phoneNumber || "",
      phoneNumber2: clinic?.phoneNumber2 || "",
      cnpj: clinic?.cnpj || "",
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
      id: `new-dentist-${Date.now()}`,
      name: "",
      photo: "",
      specialty: "",
    };

    let aux = [...dentists, newDentist];

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

    console.log("dentists", dentists);

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

    console.log("updatedClinic", updatedClinic.dentists);

    const obj = {
      clinicId: clinic.id,
      id: clinic.id,
      name: updatedClinic.name,
      cnpj: updatedClinic.cnpj,
      phone1: updatedClinic.phoneNumber,
      phone2: updatedClinic.phoneNumber2,
      address: updatedClinic.address,
      logo: updatedClinic.logo,
      dentist: updatedClinic.dentists,
      socialMedia: {
        facebook: updatedClinic.socialMedia.facebook,
        instagram: updatedClinic.socialMedia.instagram,
        website: updatedClinic.socialMedia.website,
      },
    };

    const save = await api.post("/user/update", obj);
    console.log("save", save);

    setClinic(updatedClinic);

    toast("Perfil atualizado com sucesso", {
      description: "As informações da clínica foram atualizadas",
    });

    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  console.log("dentists", dentists);

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
          <Button type="submit">
            {submitButtonText}
            {submitButtonIcon}
          </Button>
        </div>
      </form>
    </Form>
  );

  return formContent;
};
