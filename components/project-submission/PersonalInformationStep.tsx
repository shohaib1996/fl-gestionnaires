import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormData, Collaborator } from "./types";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PersonalInformationStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInformationStep: React.FC<
  PersonalInformationStepProps
> = ({ formData, updateFormData, onNext, onPrevious }) => {
  const addCollaboratorField = () => {
    updateFormData({
      collaborators: [
        ...formData.collaborators,
        {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          projectCity: "",
          residenceCity: "",
          province: "",
        },
      ],
    });
  };

  const removeCollaboratorField = (index: number) => {
    updateFormData({
      collaborators: formData.collaborators.filter((_, i) => i !== index),
    });
  };

  const updateCollaboratorField = (
    index: number,
    field: keyof FormData["collaborators"][0],
    value: string
  ) => {
    const updated = [...formData.collaborators];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ collaborators: updated });
  };

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
            3. Si le candidat est un mineur, nom du parent ou autre tuteur légal
            soumettant la candidature au nom du candidat
          </label>
          <Input
            value={formData.parentName}
            onChange={(e) => updateFormData({ parentName: e.target.value })}
            placeholder="Entrez les noms"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            4. Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => updateFormData({ phone: value || "" })}
            placeholder="Entrez votre numéro"
            defaultCountry="US"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            5. Email <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Entrez votre email"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            6. Ville ou village où se situe ou commence votre projet{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.projectCity}
            onChange={(e) => updateFormData({ projectCity: e.target.value })}
            placeholder="Entrez la ville où vous postulez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            7. Ville ou village de résidence{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.residenceCity}
            onChange={(e) => updateFormData({ residenceCity: e.target.value })}
            placeholder="Entrez la ville ou le village où vous vivez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            8. Province <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.province}
            onChange={(e) => updateFormData({ province: e.target.value })}
            placeholder="Entrez la province où vous postulez"
            className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
          />
        </div>

        <div className="py-4 border-t border-dashed border-gray-300 my-8" />

        <div className="space-y-4">
          <label className="text-sm text-gray-600">
            12. Postulez-vous avec des collaborateurs ?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="collaborators"
                  checked={formData.hasCollaborators === false}
                  onChange={() => updateFormData({ hasCollaborators: false })}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#5F9E50] checked:bg-white"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#5F9E50] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-gray-600">Non</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="collaborators"
                  checked={formData.hasCollaborators === true}
                  onChange={() => updateFormData({ hasCollaborators: true })}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#5F9E50] checked:bg-white"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#5F9E50] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-gray-600">Oui</span>
            </label>
          </div>

          {formData.hasCollaborators && (
            <>
              <p className="text-xs text-gray-500">
                Si oui, veuillez indiquer les informations de chaque
                collaborateur ci-dessous
              </p>

              <div className="space-y-8 mt-4">
                {formData.collaborators.map((collaborator, index) => (
                  <div
                    key={index}
                    className="p-6 border border-gray-200 rounded-md bg-gray-50 relative"
                  >
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaboratorField(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </div>
                    <h3 className="font-bold text-gray-700 mb-4">
                      Collaborateur {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.firstName}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                          placeholder="Prénom"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.lastName}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "lastName",
                              e.target.value
                            )
                          }
                          placeholder="Nom"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Numéro de téléphone{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <PhoneInput
                          value={collaborator.phone}
                          onChange={(value) =>
                            updateCollaboratorField(index, "phone", value || "")
                          }
                          placeholder="Téléphone"
                          defaultCountry="US"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.email}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          placeholder="Email"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Ville du projet{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.projectCity}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "projectCity",
                              e.target.value
                            )
                          }
                          placeholder="Ville du projet"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                          Ville de résidence{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.residenceCity}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "residenceCity",
                              e.target.value
                            )
                          }
                          placeholder="Ville de résidence"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-600">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={collaborator.province}
                          onChange={(e) =>
                            updateCollaboratorField(
                              index,
                              "province",
                              e.target.value
                            )
                          }
                          placeholder="Province"
                          className="bg-white border-b border-black/60 rounded-none border-t-0 border-x-0 h-10 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addCollaboratorField}
                  className="w-full h-12 border-dashed border-2 border-gray-300 hover:border-[#5F9E50] hover:text-[#5F9E50] hover:bg-transparent transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un collaborateur
                </Button>
              </div>
            </>
          )}
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
