"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AccountRequestFormData } from "./types";

interface OccupationStepProps {
  formData: AccountRequestFormData;
  updateFormData: (updates: Partial<AccountRequestFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

import { Input } from "@/components/ui/input";

export const OccupationStep: React.FC<OccupationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Occupation
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-base font-semibold text-gray-500">
            13. Profession / Occupation <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500">
            Écrivez "Aucune" si vous n'êtes pas employé(e) et n'avez pas
            d'occupation
          </p>
          <Input
            value={formData.occupation || ""}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            placeholder="Profession / Occupation"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-gray-500">
            14. Nom de l'employeur : (Optionnel)
          </label>
          <Input
            value={formData.employerName || ""}
            onChange={(e) => updateFormData({ employerName: e.target.value })}
            placeholder="Entrez le nom de votre employeur"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-gray-500">
            15. Adresse professionnelle : (Optionnel)
          </label>
          <Input
            value={formData.employerAddress || ""}
            onChange={(e) =>
              updateFormData({ employerAddress: e.target.value })
            }
            placeholder="Entrez l'adresse de votre employeur"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
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
