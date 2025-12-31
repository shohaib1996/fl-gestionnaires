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
    <div className="w-full py-8 mb-8">
      <div className="relative flex items-center w-full">
        {/* Background Line */}
        <div className="absolute top-[calc(100%-6px)] md:top-[calc(100%-8px)] left-[8.33%] right-[8.33%] transform -translate-y-1/2 h-0.5 bg-gray-300 z-10" />

        {/* Active Line */}
        <div
          className="absolute top-[calc(100%-6px)] md:top-[calc(100%-8px)] left-[8.33%] transform -translate-y-1/2 h-0.5 bg-[#5F9E50] z-10 transition-all duration-300"
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
            <div className="text-[10px] md:text-sm font-medium text-center max-w-[80px] md:max-w-[250px] h-8 flex items-end justify-center leading-tight">
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
                "w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 z-10",
                index <= currentStep ? "bg-[#5F9E50]" : "bg-gray-400"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
