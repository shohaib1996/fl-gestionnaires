"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AccountRequestFormData } from "./types";

interface FinancialStepProps {
  formData: AccountRequestFormData;
  updateFormData: (updates: Partial<AccountRequestFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const FinancialStep: React.FC<FinancialStepProps> = ({
  onNext,
  onPrevious,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Informations financières
        </h2>
      </div>

      <div className="space-y-8">
        {/* Placeholder for financial form fields */}
        <div className="text-center p-8 border border-dashed rounded-md">
          <p>Les champs du formulaire pour cette étape seront ajoutés ici.</p>
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
