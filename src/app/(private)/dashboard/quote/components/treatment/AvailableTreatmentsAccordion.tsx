import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TreatmentCard } from "./TreatmentCard";
import { StandardTreatment } from "@/@types/quotes";

interface AvailableTreatmentsAccordionProps {
  treatments: StandardTreatment[];
  onAdd: (treatment: StandardTreatment) => void;
}

export function AvailableTreatmentsAccordion({
  treatments,
  onAdd,
}: AvailableTreatmentsAccordionProps) {
  const [search, setSearch] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium mb-1">Tratamentos Disponíveis</h3>
      <Accordion
        type="single"
        collapsible
        value={isAccordionOpen ? "available" : undefined}
        onValueChange={(v) => setIsAccordionOpen(!!v)}
      >
        <AccordionItem value="available">
          <AccordionTrigger className="mb-2">
            <div className="flex items-center gap-2">
              <span>Tabela de Tratamentos</span>
              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-3">
              <Input
                placeholder="Buscar tratamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredTreatments.length === 0 ? (
                <div className="col-span-full text-muted-foreground text-center">
                  Nenhum tratamento encontrado.
                </div>
              ) : (
                filteredTreatments.map((treatment) => (
                  <TreatmentCard
                    key={treatment.name}
                    treatment={{
                      id: treatment.id,
                      name: treatment.name,
                      description: treatment.description,
                      price: treatment.price,
                      image: treatment.photo,
                    }}
                    onSelect={() => onAdd(treatment)}
                    onRemove={() => {}}
                    onEdit={() => {}}
                    compact
                  />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
