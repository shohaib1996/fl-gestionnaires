"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { createAdminAccountRequest } from "@/app/actions/createAdminAccountRequest";
import { ComplianceStep } from "@/components/admin-account-request/ComplianceStep";
import { ConfirmationStep } from "@/components/admin-account-request/ConfirmationStep";
import { IdentificationStep } from "@/components/admin-account-request/IdentificationStep";
import { PersonalInformationStep } from "@/components/admin-account-request/PersonalInformationStep";
import { ReviewStep } from "@/components/admin-account-request/ReviewStep";
import { Stepper } from "@/components/admin-account-request/Stepper";
import {
  AdminAccountRequestFormData,
  initialAdminFormData,
} from "@/components/admin-account-request/types";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { recreateAuthUser } from "../actions/recreateAuthUser";

const supabase = createClient();

const AdminAccountRequestPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] =
    useState<AdminAccountRequestFormData>(initialAdminFormData);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const updateFormData = (updates: Partial<AdminAccountRequestFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const onNext = () => setCurrentStep((prev) => prev + 1);
  const onPrevious = () => {
    if (currentStep === 0) {
      setIsStarted(false);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInformationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 1:
        return (
          <IdentificationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 2:
        return (
          <ComplianceStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={formData}
            onNext={handleSubmit}
            onPrevious={onPrevious}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return <ConfirmationStep />;
      default:
        return <div>Étape non trouvée</div>;
    }
  };
  const handleSubmit = async () => {
    if (isSubmitting) return; // safety guard

    console.log("📤 Submitting admin account request...", JSON.stringify(formData));

    try {
      setIsSubmitting(true);

      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      /* ----------------------------------
       * 1. Recreate auth user
       * ---------------------------------- */
      const authResult = await recreateAuthUser({
        email: formData.email,
        password: formData.password,
      });

      if (!authResult.ok || !authResult.userId) {
        throw new Error(authResult.error || "Auth setup failed");
      }

      /* ----------------------------------
       * 2. Prepare payload
       * ---------------------------------- */
      const payload = structuredClone(formData);
      delete payload.password;

      /* ----------------------------------
       * 3. Create admin account request
       * ---------------------------------- */
      const result = await createAdminAccountRequest({
        ...payload,
        user_id: authResult.userId,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      onNext();
    } catch (error) {
      console.error("❌ Submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-foreground">
      {/* Custom Header */}
      <header className="px-4 lg:px-0 pt-5 lg:pt-[3.5vh]">
        <div className="max-w-7xl xl:container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {currentStep !== 4 ? (
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/216_1705.png"
                  alt="FL Logo"
                  width={125}
                  height={100}
                  className="rounded-full w-20 h-auto md:w-28 lg:w-[125px]"
                />
              </Link>
            ) : (
              <div /> // Spacer to maintain layout if needed, or just null. Using div for safety with justify-between
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
              </nav>
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Demande de création de compte administrateur
            </h1>

            {/* Hero Section */}
            <div className="relative w-full h-[45vh] bg-muted rounded-xs overflow-hidden mb-8">
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                <Image
                  src="/images/Photo (1).png"
                  alt="Admin Account Request Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-8 text-sm md:text-base leading-relaxed text-foreground">
              <p>
                Bienvenue à Fond Local. Cette page est réservée aux demandes de compte
                administrateur. Veuillez lire attentivement les informations ci-dessous
                avant de remplir le formulaire.
              </p>

              <p>
                Pour commencer votre demande de compte administrateur, veuillez suivre les
                étapes ci-dessous :
              </p>

              <ol className="list-decimal pl-6 space-y-2 font-medium">
                <li>
                  <span className="font-bold">Remplir le formulaire :</span>{" "}
                  Fournissez toutes les informations demandées avec précision.
                </li>
                <li>
                  <span className="font-bold">
                    Vérification des informations :
                  </span>{" "}
                  Notre équipe examinera vos informations et documents pour
                  valider votre identité et votre éligibilité.
                </li>
                <li>
                  <span className="font-bold">Réponse à la demande :</span> Si
                  votre demande est approuvée, vous recevrez les instructions
                  pour activer votre compte administrateur.
                </li>
              </ol>

              <div>
                <h2 className="text-xl font-bold mb-4">
                  Conditions d&apos;éligibilité
                </h2>
                <p className="mb-4">
                  Pour garantir la sécurité et la conformité de notre
                  plateforme, vous devez remplir les conditions
                  d&apos;éligibilité suivantes :
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <span className="font-bold">Âge minimum :</span> Vous devez
                    avoir au moins 18 ans.
                  </li>
                  <li>
                    <span className="font-bold">
                      Identification vérifiable :
                    </span>{" "}
                    Vous devez fournir un document d&apos;identité valide.
                  </li>
                  <li>
                    <span className="font-bold">Résidence légale :</span> Vous
                    devez être citoyen congolais ou résident légal en RDC.
                  </li>
                  <li>
                    <span className="font-bold">
                      Acceptation des conditions :
                    </span>{" "}
                    Vous devez lire et accepter nos termes et conditions ainsi
                    que notre politique de confidentialité.
                  </li>
                </ol>
              </div>

              <p>
                En remplissant le formulaire de demande de compte administrateur, vous
                confirmez que vous remplissez toutes ces conditions et que vous
                acceptez de vous conformer à nos politiques et réglementations.
              </p>
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
            {currentStep !== 4 && (
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                Formulaire de demande de compte administrateur
              </h1>
            )}
            {currentStep !== 4 && <Stepper currentStep={currentStep} />}
            <div>{renderStep()}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAccountRequestPage;
