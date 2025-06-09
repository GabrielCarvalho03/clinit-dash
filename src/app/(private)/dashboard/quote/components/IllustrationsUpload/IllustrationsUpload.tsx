"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Images, Plus } from "lucide-react";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/file-upload/file-upload";

interface IllustrationsUploadProps {
  form: UseFormReturn<any>;
}

export function IllustrationsUpload({ form }: IllustrationsUploadProps) {
  const [showUploadArea, setShowUploadArea] = useState(false);
  const illustrations = form.watch("illustrationImages") || [];
  const maxImages = 4;

  useEffect(() => {
    if (illustrations.length > 0) {
      setShowUploadArea(true);
    }
  }, [illustrations]);

  const handleAddIllustration = (file: File, preview: string) => {
    const currentIllustrations = form.getValues("illustrations") || [];
    if (currentIllustrations.length < maxImages) {
      const newIllustrations = [
        ...currentIllustrations,
        { url: preview, type: "illustration" },
      ];
      form.setValue("illustrations", newIllustrations);
    }
  };

  const handleRemoveIllustration = (index: number) => {
    const currentIllustrations = form.getValues("illustrations") || [];
    const newIllustrations = currentIllustrations.filter(
      (_: any, i: any) => i !== index
    );
    form.setValue("illustrations", newIllustrations);
  };

  const handleToggleUploadArea = () => {
    setShowUploadArea(!showUploadArea);
    // Se está fechando e não tem imagens, limpa o array
    if (showUploadArea && illustrations.length === 0) {
      form.setValue("illustrations", []);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="w-full flex justify-center items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleUploadArea}
          className="w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Ilustrações (opcional)
        </Button>
      </div>

      {showUploadArea && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Adicione até 4 imagens ilustrativas que aparecerão no orçamento.
            </p>

            <FormField
              control={form.control}
              name="illustrations"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: maxImages }).map((_, index) => {
                      const illustration = illustrations[index];
                      return (
                        <div
                          key={index}
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-gray-400 transition-colors"
                        >
                          {illustration ? (
                            <div className="relative w-full h-full">
                              <img
                                src={illustration.url}
                                alt={`Ilustração ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                onClick={() => handleRemoveIllustration(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <div className="w-full h-full">
                              <FileUpload
                                onFileUploaded={(file, preview) =>
                                  handleAddIllustration(file, preview)
                                }
                                compact={true}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
