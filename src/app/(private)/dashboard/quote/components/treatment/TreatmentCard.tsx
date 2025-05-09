import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Treatment } from "@/@types/quotes";
import { Edit, Trash2, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/formart";

interface TreatmentCardProps {
  treatment: Treatment;
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  compact?: boolean;
}

export const TreatmentCard = ({
  treatment,
  onSelect,
  onEdit,
  onRemove,
  compact = false,
}: TreatmentCardProps) => {
  if (onSelect) {
    return (
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
        onClick={onSelect}
      >
        <CardContent className={`${compact ? "p-3" : "p-4"} flex flex-col`}>
          <div className="flex justify-between">
            <div className={`space-y-${compact ? "0.5" : "1"}`}>
              <h3 className={`font-medium ${compact ? "text-sm" : ""}`}>
                {treatment.name}
              </h3>
              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {treatment.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{treatment.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {treatment.description}
            </p>
            <p className="font-medium mt-2">
              {formatCurrency(treatment.price)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit size={18} />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
