import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/formart";
import { PatientProfile } from "@/@types/quotes";

type ProfileType = "common" | "conversion";

interface ProfileAnalyticsCardProps {
  type: ProfileType;
  title: string;
  description: string;
  psychologicalProfile?: PatientProfile;
  avgAge?: number;
  relationshipAvg?: string;
  avgTicket?: number;
  mostCommonTreatment?: string;
  getProfileDisplayName: (profile?: PatientProfile) => string;
}

export const ProfileAnalyticsCard = ({
  type,
  title,
  description,
  psychologicalProfile,
  avgAge,
  relationshipAvg,
  avgTicket,
  mostCommonTreatment,
  getProfileDisplayName,
}: ProfileAnalyticsCardProps) => {
  // Define background color based on card type
  const getBgColor = () => {
    if (type === "common") {
      return "bg-blue-50";
    }
    return "bg-green-50";
  };

  const getTextColor = () => {
    if (type === "common") {
      return "text-blue-800";
    }
    return "text-green-800";
  };

  const getBorderColor = () => {
    if (type === "common") {
      return "border-blue-200";
    }
    return "border-green-200";
  };

  const getIconBgColor = () => {
    if (type === "common") {
      return "bg-blue-100";
    }
    return "bg-green-100";
  };

  const hasData =
    psychologicalProfile ||
    avgAge ||
    relationshipAvg ||
    avgTicket ||
    mostCommonTreatment;

  return (
    <Card className={`${getBgColor()} ${getBorderColor()} border`}>
      <CardHeader>
        <CardTitle className={getTextColor()}>{title}</CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-4 text-gray-500">
            Dados insuficientes para análise
          </div>
        ) : (
          <div className="space-y-4">
            {psychologicalProfile && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Perfil Psicológico
                  </p>
                  <p className="font-semibold">
                    {getProfileDisplayName(psychologicalProfile)}
                  </p>
                </div>
              </div>
            )}

            {avgAge !== undefined && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12h20"></path>
                    <path d="M12 2v20"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Idade Média
                  </p>
                  <p className="font-semibold">{avgAge} anos</p>
                </div>
              </div>
            )}

            {relationshipAvg && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 2v7"></path>
                    <path d="M3 13v9"></path>
                    <path d="M12 2v7"></path>
                    <path d="M12 13v9"></path>
                    <path d="M21 2v7"></path>
                    <path d="M21 13v9"></path>
                    <path d="M1 9h22"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tempo de Relacionamento
                  </p>
                  <p className="font-semibold">{relationshipAvg}</p>
                </div>
              </div>
            )}

            {avgTicket !== undefined && avgTicket > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ticket Médio
                  </p>
                  <p className="font-semibold">{formatCurrency(avgTicket)}</p>
                </div>
              </div>
            )}

            {mostCommonTreatment && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgColor()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tratamento{" "}
                    {type === "common" ? "Mais Orçado" : "Mais Fechado"}
                  </p>
                  <p className="font-semibold">{mostCommonTreatment}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
