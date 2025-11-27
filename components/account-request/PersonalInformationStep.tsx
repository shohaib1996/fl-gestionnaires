"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountRequestFormData } from "./types";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PersonalInformationStepProps {
  formData: AccountRequestFormData;
  updateFormData: (updates: Partial<AccountRequestFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInformationStep: React.FC<
  PersonalInformationStepProps
> = ({ formData, updateFormData, onNext, onPrevious }) => {
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
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="Entrez votre prénom"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            2. Nom <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="Entrez votre nom"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            3. Postnom <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.postnom}
            onChange={(e) => updateFormData({ postnom: e.target.value })}
            placeholder="Entrez votre postnom"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            4. Date de naissance <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.birthDate}
            onChange={(e) => updateFormData({ birthDate: e.target.value })}
            placeholder="JJ/MM/AAAA"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            5. Adresse complète <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            placeholder="Rue, Quartier, Ville, Province"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            6. Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            value={formData.phoneNumber}
            onChange={(value) => updateFormData({ phoneNumber: value || "" })}
            placeholder="Entrez votre numéro de téléphone"
            defaultCountry="US"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            7. Email <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Entrez votre adresse email"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
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