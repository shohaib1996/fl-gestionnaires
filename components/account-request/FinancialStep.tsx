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
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const handleCheckboxChange = (source: string, checked: boolean) => {
    const current = formData.incomeSources || [];
    if (checked) {
      updateFormData({ incomeSources: [...current, source] });
    } else {
      updateFormData({ incomeSources: current.filter((s) => s !== source) });
    }
  };

  const incomeSources = [
    "Salaire (emploi)",
    "Commerce",
    "Revenus locatifs (loyers)",
    "Retraite ou pension",
    "Revenus de piges ou de freelances",
    "Gains de jeux ou de loteries",
    "Dons ou soutiens financiers",
    "Je n'ai aucune source de revenus",
  ];

  const currentIncomeSources = formData.incomeSources || [];

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Informations financières
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-700">
            12. Source de revenus <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-4">
            {incomeSources.map((source, index) => (
              <label
                key={source}
                htmlFor={`source-${index}`}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    id={`source-${index}`}
                    type="checkbox"
                    checked={currentIncomeSources.includes(source)}
                    onChange={(e) =>
                      handleCheckboxChange(source, e.target.checked)
                    }
                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded-sm focus:outline-none checked:bg-[#5F8E70] checked:border-[#5F8E70]"
                  />
                  {/* custom check svg */}
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
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

                <span className="text-lg text-gray-500">{source}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <input
            value={formData.otherIncomeSource || ""}
            onChange={(e) =>
              updateFormData({ otherIncomeSource: e.target.value })
            }
            placeholder="Autre source de revenu"
            className="w-full bg-[#F0F4F4] border-none h-12 px-4 rounded-xs text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5F8E70]"
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
