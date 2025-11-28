"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { Stepper } from "@/components/account-request/Stepper";
import { PersonalInformationStep } from "@/components/account-request/PersonalInformationStep";
import { IdentificationStep } from "@/components/account-request/IdentificationStep";
import { FinancialStep } from "@/components/account-request/FinancialStep";
import { OccupationStep } from "@/components/account-request/OccupationStep";
import { ComplianceStep } from "@/components/account-request/ComplianceStep";
import { ReviewStep } from "@/components/account-request/ReviewStep";
import { ConfirmationStep } from "@/components/account-request/ConfirmationStep";
import {
  AccountRequestFormData,
  initialFormData,
} from "@/components/account-request/types";

const AccountRequestPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<AccountRequestFormData>(initialFormData);

  const updateFormData = (updates: Partial<AccountRequestFormData>) => {
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
          <FinancialStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 3:
        return (
          <OccupationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 4:
        return (
          <ComplianceStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );
      case 6:
        return <ConfirmationStep />;
      default:
        return <div>Étape non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-foreground">
      {/* Custom Header */}
      <header className="px-4 lg:px-0 pt-5 lg:pt-[3.5vh]">
        <div className="max-w-7xl xl:container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {currentStep !== 6 ? (
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
              Demande de création de compte
            </h1>

            {/* Hero Section */}
            <div className="relative w-full h-[45vh] bg-muted rounded-xs overflow-hidden mb-8">
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                <Image
                  src="/images/Photo (1).png"
                  alt="Account Request Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-8 text-sm md:text-base leading-relaxed text-foreground">
              <p>
                Bienvenue à Fond Local, votre plateforme d&apos;investissement.
                Afin de garantir la sécurité et la protection de nos
                utilisateurs, l&apos;obtention d&apos;un compte Fond Local se
                fait par une procédure de demande de compte. Veuillez lire
                attentivement les informations ci-dessous avant de remplir le
                formulaire.
              </p>

              <p>
                Pour commencer votre demande de compte, veuillez suivre les
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
                  valider votre identité et votre éligibilité. Pour des raisons
                  de sécurité, nous pouvons vous demander de fournir des
                  informations supplémentaires ou de procéder à une vérification
                  par vidéo.
                </li>
                <li>
                  <span className="font-bold">Réponse à la demande :</span> Si
                  votre demande est approuvée, vous recevrez les instructions
                  pour activer votre compte.
                </li>
              </ol>

              <div>
                <h2 className="text-xl font-bold mb-4">
                  Conditions d&apos;éligibilité
                </h2>
                <p className="mb-4">
                  Pour garantir la sécurité et la conformité de notre
                  plateforme, vous devez remplir les conditions
                  d&apos;éligibilité suivantes pour obtenir un compte Fond Local
                  :
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <span className="font-bold">Âge minimum :</span> Vous devez
                    avoir au moins 18 ans (l&apos;âge légal en RDC).
                  </li>
                  <li>
                    <span className="font-bold">
                      Identification vérifiable :
                    </span>{" "}
                    Vous devez fournir un document d&apos;identité valide et une
                    preuve de résidence récente.
                  </li>
                  <li>
                    <span className="font-bold">Résidence légale :</span> Vous
                    devez être citoyen congolais ou résident légal en RDC
                  </li>
                  <li>
                    <span className="font-bold">Situation financière :</span>{" "}
                    Vous devez déclarer votre source de revenus, si applicable.
                  </li>
                  <li>
                    <span className="font-bold">
                      Conformité aux politiques de sécurité :
                    </span>{" "}
                    Vous devez consentir à la vérification des antécédents, et
                    ne pas figurer sur une liste de surveillance financière.
                  </li>
                  <li>
                    <span className="font-bold">
                      Acceptation des conditions :
                    </span>{" "}
                    Vous devez lire et accepter nos termes et conditions ainsi
                    que notre politique de confidentialité.
                  </li>
                  <li>
                    <span className="font-bold">
                      Non-participation à des activités illégales :
                    </span>{" "}
                    Si vous êtes investisseur, les fonds que vous investissez ne
                    doivent en aucun cas provenir d&apos;activités illégales.
                  </li>
                </ol>
              </div>

              <p>
                En remplissant le formulaire de demande de compte, vous
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
            {currentStep !== 6 && (
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
                Formulaire de demande de compte
              </h1>
            )}
            {currentStep !== 6 && <Stepper currentStep={currentStep} />}
            <div>{renderStep()}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountRequestPage;
