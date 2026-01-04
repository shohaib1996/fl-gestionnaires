"use client";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import React from "react";
import { Spinner } from "../ui/spinner";
import { AdminAccountRequestFormData } from "./types";

interface ReviewStepProps {
  formData: AdminAccountRequestFormData;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onNext,
  onPrevious,
  isSubmitting,
}) => {
  const renderBoolean = (value: boolean) =>
    value ? (
      <Check className="text-green-600 h-5 w-5" />
    ) : (
      <X className="text-red-600 h-5 w-5" />
    );

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
              <p className="text-base font-medium">{formData.postnom || "-"}</p>
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

        {/* Identification Information Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Type d'identification
              </p>
              <p className="text-base font-medium">
                {formData.idType.join(", ")}
                {formData.otherIdType && ` (${formData.otherIdType})`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Numéro d'identification
              </p>
              <p className="text-base font-medium">{formData.idNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Recto de la pièce d'identité
              </p>
              <p className="text-base font-medium">
                {formData.idFrontImage?.name || "Non téléchargé"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Verso de la pièce d'identité
              </p>
              <p className="text-base font-medium">
                {formData.idBackImage?.name || "Non téléchargé"}
              </p>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Conformité
          </h3>
          <div className="grid grid-cols-1 gap-y-4">
            <div className="flex items-center gap-2">
              {renderBoolean(formData.termsAccepted)}
              <span className="text-base">Termes et conditions acceptés</span>
            </div>
            <div className="flex items-center gap-2">
              {renderBoolean(formData.privacyAccepted)}
              <span className="text-base">
                Politique de confidentialité acceptée
              </span>
            </div>
          </div>
        </section>

        {/* Signature Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Signature
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nom du signataire</p>
              <p className="text-base font-medium">{formData.signerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Signature</p>
              {formData.signature ? (
                <div className="border border-gray-200 rounded-sm p-2 bg-gray-50 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.signature}
                    alt="Signature"
                    className="h-24 object-contain"
                  />
                </div>
              ) : (
                <p className="text-base font-medium text-red-500">Non signé</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-center gap-32 pt-12 pb-8">
        <Button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Précédent
        </Button>

        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-5 w-5 animate-spin text-white" />
              Envoi en cours
            </>
          ) : (
            "Envoyer"
          )}
        </Button>
      </div>
    </div>
  );
};
