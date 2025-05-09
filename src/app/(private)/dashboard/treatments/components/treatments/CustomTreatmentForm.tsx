import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface CustomTreatmentFormProps {
  customTreatment: {
    name: string;
    description: string;
    image: string;
  };
  setCustomTreatment: (treatment: any) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const DESCRIPTION_TEMPLATES = [
  {
    label: "Estético",
    value: "Tratamento com foco em melhorar a aparência do sorriso.",
  },
  {
    label: "Preventivo",
    value: "Procedimento voltado à prevenção de problemas bucais.",
  },
  {
    label: "Generalista",
    value: "Tratamento clínico de rotina com abordagem ampla.",
  },
  {
    label: "Curativo",
    value: "Procedimento indicado para tratar problemas já existentes.",
  },
  {
    label: "Restaurativo",
    value: "Indicado para recuperar dentes danificados ou perdidos.",
  },
  {
    label: "Reabilitador",
    value: "Tratamento com foco na recuperação funcional e estética.",
  },
  {
    label: "Ortodôntico",
    value: "Intervenção para correção de posição dentária e mordida.",
  },
  {
    label: "Endodôntico",
    value: "Tratamento voltado ao interior do dente (ex: canal).",
  },
  {
    label: "Periodontal",
    value: "Foco na prevenção e tratamento da gengiva e estruturas de suporte.",
  },
  {
    label: "Protético",
    value: "Reposição de dentes ou estruturas com próteses.",
  },
  {
    label: "Personalizado",
    value: "Tratamento personalizado de acordo com necessidades específicas.", // Changed from empty string to a descriptive text
  },
];

export function CustomTreatmentForm({
  customTreatment,
  setCustomTreatment,
  onCancel,
  onAdd,
}: CustomTreatmentFormProps) {
  const [templateType, setTemplateType] = useState(
    DESCRIPTION_TEMPLATES[0].label
  );

  const handleTemplateChange = (value: string) => {
    setTemplateType(value);
    const template = DESCRIPTION_TEMPLATES.find((t) => t.label === value);
    if (template) {
      // For the "Personalizado" option, we'll set an empty description to allow user input
      if (value === "Personalizado") {
        setCustomTreatment({
          ...customTreatment,
          description: "",
        });
      } else {
        setCustomTreatment({
          ...customTreatment,
          description: template.value,
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Adicionar Tratamento Personalizado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="treatment-name">Nome do Tratamento</Label>
          <Input
            id="treatment-name"
            placeholder="Ex: Clareamento Personalizado"
            value={customTreatment.name}
            onChange={(e) =>
              setCustomTreatment({ ...customTreatment, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description-template">Modelo de Descrição</Label>
          <Select value={templateType} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {DESCRIPTION_TEMPLATES.map((template) => (
                <SelectItem key={template.label} value={template.label}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment-description">Descrição</Label>
          <Textarea
            id="treatment-description"
            placeholder="Descreva o tratamento..."
            value={customTreatment.description}
            onChange={(e) =>
              setCustomTreatment({
                ...customTreatment,
                description: e.target.value,
              })
            }
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onAdd}
          disabled={!customTreatment.name.trim()}
        >
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
