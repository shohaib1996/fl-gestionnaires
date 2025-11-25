import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PersonalInformationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInformationStep: React.FC<
  PersonalInformationStepProps
> = ({ onNext, onPrevious }) => {
  const [collaboratorFields, setCollaboratorFields] = useState<string[]>([]);

  const addCollaboratorField = () => {
    setCollaboratorFields([...collaboratorFields, ""]);
  };

  const removeCollaboratorField = (index: number) => {
    setCollaboratorFields(collaboratorFields.filter((_, i) => i !== index));
  };

  const updateCollaboratorField = (index: number, value: string) => {
    const updated = [...collaboratorFields];
    updated[index] = value;
    setCollaboratorFields(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Informations personnelles
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            1. Prénom <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez votre prénom"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            2. Nom <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez votre nom"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            3. Si le candidat est un mineur, nom du parent ou autre tuteur légal
            soumettant la candidature au nom du candidat
          </label>
          <Input
            placeholder="Entrez les noms"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            4. Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez votre numéro"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            5. Email <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez votre email"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            6. Ville ou village où se situe ou commence votre projet{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez la ville où vous postulez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            7. Ville ou village de résidence{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez la ville ou le village où vous vivez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            8. Province <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Entrez la province où vous postulez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="py-4 border-t border-dashed border-gray-300 my-8" />

        <div className="space-y-4">
          <label className="text-sm text-gray-600">
            12. Postulez-vous avec des collaborateurs ?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="collaborators"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#5F9E50] checked:bg-white"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#5F9E50] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-gray-600">Non</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="collaborators"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#5F9E50] checked:bg-white"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#5F9E50] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-gray-600">Oui</span>
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Si oui, veuillez indiquer le nom de chaque collaborateur ci-dessous
          </p>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un collaborateur"
                className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={addCollaboratorField}
                className="h-12 w-12 bg-[#F0F6F4] border-none hover:bg-gray-200 shrink-0 rounded-xs"
              >
                <Plus className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            {collaboratorFields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={field}
                  onChange={(e) =>
                    updateCollaboratorField(index, e.target.value)
                  }
                  placeholder={`Collaborateur ${index + 2}`}
                  className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeCollaboratorField(index)}
                  className="h-12 w-12 bg-[#F0F6F4] border-none hover:bg-gray-200 shrink-0 rounded-xs"
                >
                  <Plus className="h-5 w-5 text-gray-500 rotate-45" />
                </Button>
              </div>
            ))}
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
