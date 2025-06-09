import { HelpCircle, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SupportWidgetProps {
  isCollapsed?: boolean;
}

export const SupportWidget = ({ isCollapsed = false }: SupportWidgetProps) => {
  const handleSupportClick = () => {
    window.open(
      "https://wa.me/5512988893431?text=Preciso de ajuda com a Clinitt.ai",
      "_blank"
    );
  };

  if (isCollapsed) {
    return (
      <div className="p-1">
        <button
          onClick={handleSupportClick}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20"
          title="Suporte"
        >
          <HelpCircle size={16} className="text-primary" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Card className="bg-red-300 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
        <CardContent className=" px-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10">
              <MessageCircle size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Precisa de ajuda?
              </h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Nossa equipe está aqui para te ajudar!
              </p>
              <button
                onClick={handleSupportClick}
                className="w-10/12 text-xs bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm"
              >
                Fale conosco
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
