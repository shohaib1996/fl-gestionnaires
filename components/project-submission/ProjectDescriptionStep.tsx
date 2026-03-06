import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, CloudUpload, X } from "lucide-react";
import { FormData } from "./types";
import Image from "next/image";

interface ProjectDescriptionStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MAX_IMAGES = 6;

export const ProjectDescriptionStep: React.FC<ProjectDescriptionStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const addLink = () => {
    updateFormData({ links: [...formData.links, ""] });
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    updateFormData({ links: newLinks });
  };

  const removeLink = (index: number) => {
    updateFormData({ links: formData.links.filter((_, i) => i !== index) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const currentLogos = formData.logos || [];

      // Limit to MAX_IMAGES total
      const availableSlots = MAX_IMAGES - currentLogos.length;
      const filesToAdd = filesArray.slice(0, availableSlots);

      if (filesToAdd.length > 0) {
        updateFormData({ logos: [...currentLogos, ...filesToAdd] });
      }

      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newLogos = formData.logos.filter((_, i) => i !== index);
    updateFormData({ logos: newLogos });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Description de votre projet
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-base md:text-sm text-gray-600">
            13. Veuillez fournir une description non confidentielle de votre
            projet ou produit
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Description non confidentielle"
            className="bg-[#F0F4F4] border-none min-h-[120px] text-base placeholder:text-gray-400 resize-none rounded-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-base md:text-sm text-gray-600">
            14. Si vous en avez, vous pouvez télécharger des images de votre
            logo, produit ou entreprise (Maximum {MAX_IMAGES} images)
          </label>

          {/* Image Previews */}
          {formData.logos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.logos.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden border-2 border-gray-200">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {formData.logos.length < MAX_IMAGES && (
            <div className="border-2 border-dashed border-gray-300 rounded-sm bg-[#F0F4F4] p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="bg-gray-200 rounded-full p-4 mb-4">
                <CloudUpload className="h-10 w-10 text-white" />
              </div>

              <p className="text-base md:text-sm text-gray-600 mb-2">
                {formData.logos.length} / {MAX_IMAGES} images téléchargées
              </p>

              <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-sm mt-2">
                <span className="text-sm text-black font-medium">
                  Déposez les images ici ou
                </span>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                />
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-gray-50 h-8 text-xs font-normal shadow-sm"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  type="button"
                >
                  Sélectionnez des fichiers
                </Button>
              </div>
            </div>
          )}

          {formData.logos.length >= MAX_IMAGES && (
            <p className="text-sm text-amber-600 text-center">
              Limite maximale de {MAX_IMAGES} images atteinte
            </p>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-base md:text-sm text-gray-600">
            15. Avez-vous un lien à partager concernant votre projet ? (Exemple
            : site web, réseaux sociaux, vidéos, documents en ligne...)
          </label>

          <div className="space-y-3">
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="Entrez un lien"
                  className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
                />
                {index > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeLink(index)}
                    className="h-12 w-12 bg-[#F0F4F4] border-none hover:bg-gray-200 shrink-0 rounded-xs"
                  >
                    <Plus className="h-5 w-5 text-gray-500 rotate-45" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={addLink}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-transparent"
            >
              <Plus className="h-6 w-6 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-32 pt-12 pb-8">
          <Button
            onClick={onPrevious}
            className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs"
          >
            Précédent
          </Button>
          <Button
            onClick={onNext}
            className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};
