import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormData } from "../../components/project-submission/types";

interface ProjectCategoryStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const categories = [
  "Activités maritimes",
  "Agriculture / Agroalimentaire",
  "Alimentation & Boissons",
  "Animaux domestiques",
  "Application / Site Web",
  "Artisanat",
  "Art",
  "Articles Ménagers / Design d'Intérieur",
  "Automobile / Transport",
  "Beauté",
  "Bricolage / Bâtiment",
  "Construction",
  "Divertissement / Expérience",
  "Écologie / Environnement",
  "Éducation",
  "Enfants",
  "Événementiel / Organisation d'événements",
  "Fêtes",
  "Finance / Investissement",
  "Fitness",
  "Immobilier",
  "Industries créatives",
  "Jouets / Jeux",
  "Médias / Communication",
  "Mode de vie durable",
  "Musique",
  "Pêche",
  "Restauration / Hôtellerie",
  "Santé / Bien-être / Nutrition",
  "Services de santé",
  "Services en ligne",
  "Services professionnels",
  "Services sociaux / Communautaires",
  "Sports",
  "Technologie",
  "Technologie de pointe",
  "Télécommunications",
  "Vêtements / Mode",
  "Voyage / Tourisme",
];

const phases = [
  "Idée",
  "Recherche & Développement",
  "Prototype / Test Bêta",
  "Financement",
  "Opération / Expédition",
];

export const ProjectCategoryStep: React.FC<ProjectCategoryStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const toggleCategory = (category: string) => {
    const currentCategories = formData.categories;
    if (currentCategories.includes(category)) {
      updateFormData({
        categories: currentCategories.filter((c) => c !== category),
      });
    } else {
      updateFormData({ categories: [...currentCategories, category] });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Nom et catégorie de votre projet
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            9. Quel est le nom de votre projet ou produit ?{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.projectName}
            onChange={(e) => updateFormData({ projectName: e.target.value })}
            placeholder="Entrez un nom"
            className="bg-[#F0F4F4] border-none rounded-xs h-12 text-base placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm text-gray-600">
            10. Quelle catégorie décrit le mieux votre projet ou produit ?
            (Cochez toutes celles qui s'appliquent){" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {categories.map((category, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:border-[#5F9E50] checked:bg-[#5F9E50]"
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-gray-600">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-sm text-gray-600">
            11. Quelle est la phase actuelle de votre projet ou produit ?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="projectPhase"
                    checked={formData.projectPhase === phase}
                    onChange={() => updateFormData({ projectPhase: phase })}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#5F9E50] checked:bg-white"
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#5F9E50] opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-600">{phase}</span>
              </label>
            ))}
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
    </div>
  );
};
