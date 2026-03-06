import { cn } from "@/lib/utils";
import React from "react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  "Informations personnelles",
  " Nom et catégorie",
  "Description de votre projet",
  "Signature",
  "Vérification",
  "Confirmation",
];

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  if (currentStep === 5) return null;
  return (
    <div className="w-full py-4 md:py-8 mb-6 md:mb-8">
      {/* Mobile: compact single-row progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xl font-medium text-[#5F9E50]">
            Étape {currentStep + 1} / {steps.length}
          </span>
          <span className="text-xl font-semibold text-black">
            {steps[currentStep]}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full">
          <div
            className="h-1.5 bg-[#5F9E50] rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        {/* Dots row */}
        <div className="relative flex items-center w-full mt-3">
          {steps.map((_, index) => (
            <div key={index} className="flex-1 flex justify-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-[#5F9E50]" : "bg-gray-300"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: full stepper with labels */}
      <div className="hidden md:block">
        <div className="relative flex items-center w-full">
          {/* Background Line */}
          <div className="absolute top-[calc(100%-8px)] left-[8.33%] right-[8.33%] transform -translate-y-1/2 h-0.5 bg-gray-300 z-10" />

          {/* Active Line */}
          <div
            className="absolute top-[calc(100%-8px)] left-[8.33%] transform -translate-y-1/2 h-0.5 bg-[#5F9E50] z-10 transition-all duration-300"
            style={{
              width: `calc((100% - 16.66%) * ${
                currentStep / (steps.length - 1)
              })`,
            }}
          />

          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-4 group"
            >
              <div className="text-sm font-medium text-center max-w-[250px] h-8 flex items-end justify-center leading-tight">
                <span
                  className={cn(
                    "transition-colors duration-300",
                    index <= currentStep ? "text-black" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              <div
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300 z-10",
                  index <= currentStep ? "bg-[#5F9E50]" : "bg-gray-400"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
