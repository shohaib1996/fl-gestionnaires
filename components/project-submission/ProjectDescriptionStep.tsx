import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, CloudUpload } from "lucide-react";
import { FormData } from "./types";

interface ProjectDescriptionStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

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
    if (e.target.files && e.target.files[0]) {
      updateFormData({ logo: e.target.files[0] });
    }
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
          <label className="text-sm text-gray-600">
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
          <label className="text-sm text-gray-600">
            14. Si vous en avez, vous pouvez télécharger votre logo ou une image
            de votre produit ou de votre entreprise.
          </label>
          <div className="border-2 border-gray-200 rounded-sm bg-[#F0F4F4] p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
            <div className="bg-gray-200 rounded-full p-4 mb-4">
              <CloudUpload className="h-10 w-10 text-white" />
            </div>

            <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-sm mt-4">
              <span className="text-sm text-black font-medium">
                {formData.logo ? formData.logo.name : "Déposez l'image ici ou"}
              </span>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-50 h-8 text-xs font-normal shadow-sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Sélectionnez un fichier
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm text-gray-600">
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
