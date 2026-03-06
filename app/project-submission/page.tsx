"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { uploadLogo } from "@/app/actions/upload-logo";
import { ConfirmationStep } from "@/components/project-submission/ConfirmationStep";
import { PersonalInformationStep } from "@/components/project-submission/PersonalInformationStep";
import { ProjectCategoryStep } from "@/components/project-submission/ProjectCategoryStep";
import { ProjectDescriptionStep } from "@/components/project-submission/ProjectDescriptionStep";
import { SignatureStep } from "@/components/project-submission/SignatureStep";
import { Stepper } from "@/components/project-submission/Stepper";
import {
  FormData,
  initialFormData,
} from "@/components/project-submission/types";
import { VerificationStep } from "@/components/project-submission/VerificationStep";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { generateProjectId } from "@/lib/project-id-mappings";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { createProject } from "../actions";

const ProjectSubmission = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (isSubmitting) return; // guard

    // only submit logic needs loading
    if (currentStep !== 4) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      return;
    }

    try {
      setIsSubmitting(true);

      /* ---------------------------
       * 1. Debug sanitize (optional)
       * --------------------------- */
      const sanitize = (fd: FormData) => {
        const { logos, ...rest } = fd as any;
        return {
          ...rest,
          logos:
            logos?.map((logo: File) => ({
              name: logo.name,
              size: logo.size,
              type: logo.type,
            })) || [],
        };
      };

      console.log("🔍 FULL FORM DATA:", sanitize(formData));

      /* ---------------------------
       * 2. Upload logos
       * --------------------------- */
      const logoUrls: string[] = [];

      if (formData.logos?.length) {
        for (let i = 0; i < formData.logos.length; i++) {
          const uploadResult = await uploadLogo(formData.logos[i]);

          if (uploadResult.error) {
            toast.error(`Image ${i + 1} upload failed.`);
            return;
          }

          logoUrls.push(uploadResult.url!);
        }

        updateFormData({ logoUrls });
      }

      /* ---------------------------
       * 3. Generate project ID
       * --------------------------- */
      const projectId = generateProjectId(
        formData.province,
        formData.categories
      );

      /* ---------------------------
       * 4. Build payload
       * --------------------------- */
      const projectData = {
        project_id: projectId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        parent_name: formData.parentName || null,
        phone: formData.phone,
        email: formData.email,
        project_city: formData.projectCity,
        residence_city: formData.residenceCity,
        province: formData.province,
        collaborators: formData.hasCollaborators ? formData.collaborators : [],
        title: formData.projectName,
        description: formData.description,
        categories: formData.categories,
        phase: formData.projectPhase,
        links: formData.links.filter(Boolean),
        logo_urls: logoUrls,
        signature: formData.signature || null,
        signer_name: formData.signerName || null,
        claim_count: 0,
      };

      /* ---------------------------
       * 5. Save project
       * --------------------------- */
      const result = await createProject(projectData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      /* ---------------------------
       * 6. Go to confirmation
       * --------------------------- */
      setCurrentStep(5);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      setIsStarted(false);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-foreground">
      {/* Custom Header */}
      <header className="px-4 lg:px-0 pt-5 lg:pt-[3.5vh]">
        <div className="max-w-7xl xl:container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {currentStep !== 5 && (
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/FLLogo.svg"
                  alt="FL Logo"
                  width={125}
                  height={100}
                  className="rounded-full w-20 h-auto md:w-28 lg:w-[125px] object-fill"
                />
              </Link>
            )}

            {/* Desktop/Laptop Navigation (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:flex justify-between items-center flex-2 w-full ml-8 lg:ml-5">
              {/* Navigation Links */}
              <nav className="flex items-center gap-6 text-lg font-medium text-muted-foreground">
                <Link href="#" className="hover:text-foreground">
                  FOND LOCAL
                </Link>
                <div className="h-12 w-px bg-black/50" />
                <Link href="#" className="hover:text-foreground">
                  Soumission de Projet
                </Link>
                {/* <div className="h-12 w-px bg-black/50" /> */}
              </nav>

              {/* <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <div className="bg-primary p-0.5 rounded-sm">
                      <Search className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <Input
                    type="text"
                    placeholder="Recherche"
                    className="pl-12 text-lg rounded-xs bg-secondary border-none h-9 focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                  />
                </div>

                <div className="h-12 w-px bg-black/50" />
                <Link
                  href="/login"
                  className="text-lg font-medium text-muted-foreground hover:text-foreground"
                >
                  Connexion
                </Link>
              </div> */}
            </div>

            {/* Mobile/Tablet Navigation (Hamburger Menu) */}
            <div className="lg:hidden flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11">
                    <Menu className="size-9" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-8 p-5">
                    <nav className="flex flex-col gap-4 text-lg font-medium text-muted-foreground">
                      <Link href="#" className="hover:text-foreground">
                        La une
                      </Link>
                      <Link href="#" className="hover:text-foreground">
                        Rapport du marché
                      </Link>
                    </nav>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <div className="bg-primary p-0.5 rounded-sm">
                          <Search className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                      <Input
                        type="text"
                        placeholder="Recherche"
                        className="pl-12 text-lg rounded-xs bg-secondary border-none h-9 focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                      />
                    </div>
                    <Link
                      href="/login"
                      className="text-lg font-medium text-muted-foreground hover:text-foreground"
                    >
                      Connexion
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        {!isStarted ? (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Section */}
            <div className="relative w-full h-[45vh] bg-muted rounded-xs overflow-hidden mb-8">
              {/* Placeholder for the hero image - using a generic office/meeting image if available or a colored div */}
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                {/* Attempting to use a placeholder image from unsplash source or similar if allowed, 
                        but for now sticking to a solid color or the user's uploaded image if I could access it. 
                        I'll use a standard placeholder pattern. */}
                <Image
                  src="/images/Photo.png" // Trying manager.png as a placeholder, if it exists and looks okay.
                  alt="Team working"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6 text-lg md:text-base leading-relaxed text-foreground">
              <p>
                Bienvenue sur la page de soumission en ligne de Fond Local !
              </p>

              <p>
                Fond local est un programme d&apos;investissement qui organise,
                entre autres, des événements de pitch où les entrepreneurs
                présentent leurs entreprises, produits ou idées à un groupe
                d&apos;investisseurs ou de partenaires potentiels, dans le but
                de les convaincre d&apos;investir.
              </p>

              <p>
                Les organisateurs du Fond Local cherchent à travers le pays les
                prochains entrepreneurs, innovateurs, créateurs et inventeurs
                avec les projets les plus prometteurs que la République
                Démocratique du Congo a à offrir. Postulez pour
                l&apos;opportunité de présenter votre projet au Fond Local et de
                potentiellement obtenir un investissement.
              </p>

              <p>
                Veuillez noter que vous devez remplir les conditions
                d&apos;éligibilité suivantes pour participer à l&apos;événement
                :
              </p>

              <ul className="list-disc pl-6 space-y-4">
                <li>
                  Vous devez avoir 18 ans (l&apos;âge de la majorité en RDC) ou
                  plus ; ou si vous avez moins de l&apos;âge de la majorité, vos
                  parents et/ou tuteurs légaux doivent postuler en votre nom et
                  doivent également signer et accepter tous les documents liés à
                  votre participation potentielle.
                </li>
                <li>
                  Vous devez être légal et physiquement présent en République
                  Démocratique du Congo pendant l&apos;événement de pitch
                </li>
                <li>
                  Vous ne pouvez pas être un candidat pour un poste public.
                </li>
                <li>
                  Vous ne devez pas avoir été condamné pour un crime grave au
                  cours des 10 dernières années (sauf si innocenté ou effacé).
                </li>
                <li>
                  Ni vous, ni aucun membre de votre famille immédiate ne pouvez
                  être actuellement — ni avoir été au cours de l&apos;année
                  écoulée — employé à temps plein, cadre ou directeur d&apos;une
                  entreprise ou d&apos;une entité liée au Fond Local.
                </li>
                <li>
                  Vous devez être disposé à vous soumettre à une vérification
                  des antécédents.
                </li>
              </ul>
            </div>

            {/* Footer Action */}
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => setIsStarted(true)}
                className="bg-[#5F9E50] hover:bg-[#4d8240] text-white px-12 py-6 text-lg rounded-xs"
              >
                Continuer
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <Stepper currentStep={currentStep} />

            <div className="mt-8">
              {currentStep === 0 && (
                <PersonalInformationStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}
              {currentStep === 1 && (
                <ProjectCategoryStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}
              {currentStep === 2 && (
                <ProjectDescriptionStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}
              {currentStep === 3 && (
                <SignatureStep
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}

              {currentStep === 4 && (
                <VerificationStep
                  formData={formData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === 5 && <ConfirmationStep />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectSubmission;
