import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserIcon } from "lucide-react";

interface ClinicProfileDescriptionProps {
  title: string;
  description: string;
}

export const ClinicProfileDescription = ({
  title,
  description,
}: ClinicProfileDescriptionProps) => {
  // Verificamos especificamente por mensagens que indicam falta de dados suficientes
  const isEmptyDescription = description.includes(
    "Adicione pelo menos dois orçamentos"
  );

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
        {isEmptyDescription ? (
          <div className="text-center py-4 text-gray-500">{description}</div>
        ) : (
          <p className="text-gray-700">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
