"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dentist } from "@/@types/auth";
import { FileUpload } from "@/components/file-upload/file-upload";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

interface DentistItemProps {
  dentist: Dentist;
  onUpdate: (dentist: Dentist) => void;
  onRemove: (id: string) => void;
  index: number;
}

export const DentistItem = ({
  dentist,
  onUpdate,
  onRemove,
  index,
}: DentistItemProps) => {
  const [isEditing, setIsEditing] = useState(dentist.name === "");
  const [name, setName] = useState(dentist.name);
  const [specialty, setSpecialty] = useState(dentist.specialty || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { dentists, setDentists } = useAnalytics();

  // Ensure photo state is updated when dentist prop changes
  useEffect(() => {
    console.log("DentistItem: dentist data updated", dentist);
    setName(dentist.name);
    setSpecialty(dentist.specialty || "");

    // Make sure we update the photo preview whenever it changes
    if (dentist.photo) {
      console.log(
        "Loading dentist photo from prop:",
        dentist.photo.substring(0, 50) + "..."
      );
      setPhotoPreview(dentist.photo);
    } else {
      setPhotoPreview(null);
    }
  }, [dentist]);

  const handleSave = () => {
    // Create an updated dentist with the current data
    const updatedDentist: Dentist = {
      ...dentist,
      name,
      specialty,
      // Important: Ensure the photo is preserved in the update
      photo: photoPreview || dentist.photo || "",
    };

    console.log(
      "Saving dentist with photo:",
      updatedDentist.photo ? "present" : "absent"
    );
    onUpdate(updatedDentist);
    setIsEditing(false);
  };

  const handlePhotoUpload = (file: File, preview: string) => {
    console.log("New photo uploaded for dentist");
    setPhotoFile(file);
    setPhotoPreview(preview);

    // Save the photo immediately to ensure it persists
    onUpdate({
      ...dentist,
      name,
      specialty,
      photo: preview,
    });
  };

  const handleDelete = () => {
    onRemove(dentist.id);
    setDeleteDialogOpen(false);
  };
  const handleDeleteList = () => {
    const ewDentists = dentists.filter((d, i) => i !== index);

    setDentists(ewDentists);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid md:grid-cols-[200px_1fr] gap-4">
          <div>
            {isEditing ? (
              <FileUpload
                onFileUploaded={handlePhotoUpload}
                initialPreview={photoPreview || dentist.photo}
                label="Foto do Dentista"
              />
            ) : (
              <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                {photoPreview || dentist.photo ? (
                  <img
                    src={photoPreview || dentist.photo}
                    alt={name}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: "transparent" }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    Sem foto
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">
                      Nome do Dentista *
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Especialidade/CRO
                    </label>
                    <Input
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ortodontia, Implantodontia, etc."
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (dentist.name) {
                        setName(dentist.name);
                        setSpecialty(dentist.specialty || "");
                        setIsEditing(false);
                      } else {
                        handleDeleteList();
                      }
                    }}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    type="button"
                  >
                    Salvar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {specialty || "Sem especialidade definida"}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    type="button"
                  >
                    Editar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover dentista</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este dentista? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
