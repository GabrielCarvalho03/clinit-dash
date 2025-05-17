import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { LightbulbIcon } from "lucide-react";

interface SuggestionsListProps {
  suggestions: { phrase: string }[];
  title?: string;
  isDentistSpecific?: boolean;
}

export const SuggestionsList = ({
  suggestions,
  title = "Sugestões de Melhoria",
  isDentistSpecific = false,
}: SuggestionsListProps) => {
  const { seggestionsIsLoading } = useAnalytics();

  console.log("suggestions", seggestionsIsLoading);

  // Now showing empty state only when suggestions array is completely empty
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
          <CardDescription>
            {isDentistSpecific
              ? "Insights personalizados para melhorar os resultados deste dentista"
              : "Com base na análise dos dados, estas sugestões podem ajudar a melhorar seus resultados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            Adicione pelo menos dois orçamentos para obter insights
            personalizados.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>
          {isDentistSpecific
            ? "Insights personalizados para melhorar os resultados deste dentista"
            : "Com base na análise dos dados, estas sugestões podem ajudar a melhorar seus resultados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {seggestionsIsLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {suggestions?.map((suggestion, index) => (
              <li
                key={index}
                className="border-l-4 border-yellow-400 pl-4 py-1"
              >
                <p className="text-gray-700">{suggestion.phrase}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
