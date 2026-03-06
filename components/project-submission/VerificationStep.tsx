import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { Spinner } from "../ui/spinner";
import { FormData } from "./types";

interface VerificationStepProps {
  formData: FormData;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  formData,
  onNext,
  onPrevious,
  isSubmitting,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Vérification
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
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                1. Prénom <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.firstName}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                2. Nom <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.lastName}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                3. Si le candidat est un mineur, nom du parent ou autre tuteur
                légal soumettant la candidature au nom du candidat
              </p>
              <p className="text-base font-medium">
                {formData.parentName || "-"}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                4. Numéro de téléphone <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.phone}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                5. Email <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                6. Ville ou village où se situe ou commence votre projet{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.projectCity}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                7. Ville ou village de résidence{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.residenceCity}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                8. Province <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.province}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                12. Postulez-vous avec des collaborateurs ?{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-base font-medium mb-2">
                {formData.hasCollaborators ? "Oui" : "Non"}
              </p>
              {formData.hasCollaborators &&
                formData.collaborators.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.collaborators.map((collab, index) => (
                      <li key={index} className="text-base font-medium">
                        {collab.firstName} {collab.lastName}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        </section>
        {/* Project Category Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Nom et catégorie de votre projet
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                9. Quel est le nom de votre projet ou produit ?{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.projectName}</p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                10. Quelle catégorie décrit le mieux votre projet ou produit ?{" "}
                <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.categories.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                11. Quelle est la phase actuelle de votre projet ou produit ?{" "}
                <span className="text-red-500">*</span>
              </p>
              <p className="text-xl md:text-base font-medium">{formData.projectPhase}</p>
            </div>
          </div>
        </section>
        {/* Project Description Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Description de votre projet
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                13. Veuillez fournir une description non confidentielle de votre
                projet ou produit
              </p>
              <p className="text-base font-medium whitespace-pre-wrap">
                {formData.description}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                14. Logos ou images du produit
              </p>
              {formData.logos && formData.logos.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-base font-medium">
                    {formData.logos.length} image(s) téléchargée(s)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.logos.map((logo, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-2 rounded border border-gray-200"
                      >
                        <Image
                          src={URL.createObjectURL(logo)}
                          alt={`Logo ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {logo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-base font-medium text-gray-400">
                  Aucune image sélectionnée
                </p>
              )}
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">15. Liens partagés</p>
              {formData.links.some((link) => link.trim() !== "") ? (
                <ul className="list-disc pl-5 space-y-1">
                  {formData.links
                    .filter((link) => link.trim() !== "")
                    .map((link, index) => (
                      <li key={index} className="text-base font-medium">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-base font-medium text-gray-400">
                  Aucun lien fourni
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Signature Section */}
        <section>
          <h3 className="text-base font-bold text-black border-b border-[#C8E6C9] pb-1 mb-6 inline-block">
            Signature
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                17. Signature numérique
              </p>
              {formData.signature ? (
                <div className="border border-gray-200 rounded-sm p-2 inline-block bg-[#F0F4F4]">
                  <img
                    src={formData.signature}
                    alt="Signature"
                    className="h-24 w-auto"
                  />
                </div>
              ) : (
                <p className="text-base font-medium text-red-500">Non signé</p>
              )}
            </div>
            <div>
              <p className="text-2xl md:text-sm text-gray-500 mb-1">
                18. Nom complet du signataire
              </p>
              <p className="text-xl md:text-base font-medium">{formData.signerName}</p>
            </div>
          </div>
        </section>
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
    </div>
  );
};
