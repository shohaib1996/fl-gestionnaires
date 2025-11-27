"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AccountRequestFormData } from "./types";

interface ReviewStepProps {
  formData: AccountRequestFormData;
  onNext: () => void;
  onPrevious: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Revoir
        </h2>
      </div>

      <div className="space-y-12">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-gray-500 mb-1">Prénom</p>
              <p className="text-base font-medium">{formData.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nom</p>
              <p className="text-base font-medium">{formData.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Postnom</p>
              <p className="text-base font-medium">{formData.postnom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date de naissance</p>
              <p className="text-base font-medium">{formData.birthDate}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Adresse complète</p>
              <p className="text-base font-medium">{formData.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Numéro de téléphone</p>
              <p className="text-base font-medium">{formData.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-base font-medium">{formData.email}</p>
            </div>
          </div>
        </section>

        {/* Other sections will be added here */}
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
          Envoyer
        </Button>
      </div>
    </div>
  );
};
