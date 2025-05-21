import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { TreatmentData } from "./TreatmentRanking";

interface ClinicProfileDescriptionProps {
  title: string;
  description: string;
  data: TreatmentData[];
}

export const ClinicProfileDescription = ({
  title,
  description,
  data,
}: ClinicProfileDescriptionProps) => {
  // Verificamos especificamente por mensagens que indicam falta de dados suficientes
  const isEmptyDescription = description.includes(
    "Adicione pelo menos dois orçamentos"
  );

  console.log("dataTestando", data);

  return (
    <Card className="mb-6 border-primary/10 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          Características gerais com base na análise dos dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <div className="text-center py-4 text-gray-500">
            {
              "Adicione pelo menos dois orçamentos para gerar um perfil da clínica."
            }
          </div>
        ) : (
          <p className="text-gray-700">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
