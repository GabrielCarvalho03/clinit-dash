import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload/file-upload";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";

interface TreatmentImageUploadImage {
  url: string;
  type: "before-after" | "xray" | "treatment" | "other";
  description?: string;
}

interface TreatmentImageUploadProps {
  value: TreatmentImageUploadImage[];
  onChange: (images: TreatmentImageUploadImage[]) => void;
}

export function TreatmentImageUpload({
  value = [],
  onChange,
}: TreatmentImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const maxImages = 2; // Fixed to exactly 2 slots

  const handleFileUploaded = (file: File, preview: string, index: number) => {
    const newImages = [...value];
    newImages[index] = { url: preview, type: "treatment" };
    onChange(newImages.slice(0, maxImages));
    setError(null);
  };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages[index] = undefined as any;
    onChange(newImages.filter(Boolean));
    setError(null);
  };

  // Always show exactly 2 slots
  const displayImages = [...value, undefined, undefined].slice(0, maxImages);

  return (
    <div className="space-y-4">
      <Label>Imagens do Tratamento (opcional)</Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayImages.map((image, index) => (
          <Card key={index} className="p-2">
            <FileUpload
              onFileUploaded={(file, preview) =>
                handleFileUploaded(file, preview, index)
              }
              initialPreview={image?.url}
              onClear={() => handleRemove(index)}
              compact={true}
            />
          </Card>
        ))}
      </div>

      {error && <FormMessage>{error}</FormMessage>}
      <p className="text-xs text-muted-foreground text-center mt-2">
        Imagens com finalidade exclusivamente ilustrativa do procedimento
        descrito.
      </p>
    </div>
  );
}
