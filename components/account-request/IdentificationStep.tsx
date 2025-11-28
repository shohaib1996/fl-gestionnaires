"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload } from "lucide-react";
import { AccountRequestFormData } from "./types";

interface IdentificationStepProps {
  formData: AccountRequestFormData;
  updateFormData: (updates: Partial<AccountRequestFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "idFrontImage" | "idBackImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ [field]: e.target.files[0] });
    }
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    const current = formData.idType || [];
    if (checked) {
      updateFormData({ idType: [...current, type] });
    } else {
      updateFormData({ idType: current.filter((t) => t !== type) });
    }
  };

  const idTypes = [
    "Carte d'identité (Carte d'électeur)",
    "Passeport",
    "Permis de conduire",
    "Carte de résidence",
    "Certificat de naissance",
  ];

  const currentIdTypes = formData.idType || [];

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Documents d'identification
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Veuillez sélectionner au moins un type d'identification
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-700">
            8. Type d'identification <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3 mt-2">
            {idTypes.map((type, index) => (
              <label
                key={type}
                htmlFor={`idtype-${index}`}
                className="flex items-center gap-4 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    id={`idtype-${index}`}
                    type="checkbox"
                    checked={currentIdTypes.includes(type)}
                    onChange={(e) =>
                      handleCheckboxChange(type, e.target.checked)
                    }
                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-sm focus:outline-none checked:bg-[#5F8E70] checked:border-[#5F8E70]"
                  />
                  {/* custom check svg */}
                  <svg
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: "translateY(-1px)" }}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <span className="text-lg text-gray-500">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Input
            value={formData.otherIdType || ""}
            onChange={(e) => updateFormData({ otherIdType: e.target.value })}
            placeholder="Autre type d'identification"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="idNumber"
            className="text-sm font-semibold text-gray-700"
          >
            9. Numéro du document
          </label>
          <Input
            id="idNumber"
            value={formData.idNumber || ""}
            onChange={(e) => updateFormData({ idNumber: e.target.value })}
            placeholder="Entrez le numéro du document"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            10. Veuillez télécharger une copie claire du recto de votre document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-sm bg-[#F0F4F4] p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
            <CloudUpload className="h-10 w-10 text-gray-400 mb-4" />
            <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-sm mt-4">
              <span className="text-sm text-black font-medium">
                {formData.idFrontImage
                  ? formData.idFrontImage.name
                  : "Déposez l'image ici ou"}
              </span>
              <input
                type="file"
                id="idFrontImage-upload"
                className="hidden"
                onChange={(e) => handleFileChange(e, "idFrontImage")}
                accept="image/*"
              />
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-50 h-8 text-xs font-normal shadow-sm"
                onClick={() =>
                  document.getElementById("idFrontImage-upload")?.click()
                }
              >
                Sélectionnez un fichier
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            11. Veuillez télécharger une copie claire du verso de votre document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-sm bg-[#F0F4F4] p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
            <CloudUpload className="h-10 w-10 text-gray-400 mb-4" />
            <div className="flex items-center gap-2 bg-gray-200/50 px-4 py-2 rounded-sm mt-4">
              <span className="text-sm text-black font-medium">
                {formData.idBackImage
                  ? formData.idBackImage.name
                  : "Déposez l'image ici ou"}
              </span>
              <input
                type="file"
                id="idBackImage-upload"
                className="hidden"
                onChange={(e) => handleFileChange(e, "idBackImage")}
                accept="image/*"
              />
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-50 h-8 text-xs font-normal shadow-sm"
                onClick={() =>
                  document.getElementById("idBackImage-upload")?.click()
                }
              >
                Sélectionnez un fichier
              </Button>
            </div>
          </div>
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
  );
};
