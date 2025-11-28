import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AccountRequestFormData } from "./types";

interface ComplianceStepProps {
  formData: AccountRequestFormData;
  updateFormData: (updates: Partial<AccountRequestFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Load signature from formData if it exists
  useEffect(() => {
    if (sigCanvas.current && formData.signature) {
      sigCanvas.current.fromDataURL(formData.signature);
    }
  }, []);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    updateFormData({ signature: null });
  };

  const handleSignatureEnd = () => {
    if (sigCanvas.current) {
      updateFormData({ signature: sigCanvas.current.toDataURL() });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="space-y-8">
        {/* Confidentialité et sécurité */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-black">
            Confidentialité et sécurité
          </h3>
          <p className="text-sm text-black leading-relaxed">
            Toutes les informations fournies seront traitées de manière
            confidentielle et sécurisée. Nous utilisons des mesures de sécurité
            avancées pour protéger vos données personnelles. Pour plus
            d'informations, veuillez consulter notre{" "}
            <a href="#" className="underline">
              Politique de confidentialité
            </a>{" "}
            et nos{" "}
            <a href="#" className="underline">
              Terme et conditions
            </a>
          </p>
        </div>

        {/* Conformité et déclarations */}
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
              Conformité et déclarations
            </h2>
          </div>

          {/* Question 16 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="text-base text-black">
              16. Acceptez-vous les termes et conditions ?
            </label>
            <RadioGroup
              className="flex gap-6 bg-white p-1"
              value={formData.termsAccepted ? "yes" : "no"}
              onValueChange={(val) =>
                updateFormData({ termsAccepted: val === "yes" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="terms-yes" />
                <Label htmlFor="terms-yes" className="font-normal text-base">
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="terms-no" />
                <Label htmlFor="terms-no" className="font-normal text-base">
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 17 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="text-base text-black">
              17. Acceptez-vous la politique de confidentialité ?
            </label>
            <RadioGroup
              className="flex gap-6 bg-white p-1"
              value={formData.privacyAccepted ? "yes" : "no"}
              onValueChange={(val) =>
                updateFormData({ privacyAccepted: val === "yes" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="privacy-yes" />
                <Label htmlFor="privacy-yes" className="font-normal text-base">
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="privacy-no" />
                <Label htmlFor="privacy-no" className="font-normal text-base">
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 18 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="text-base text-black">
              18. Confirmez-vous que les fonds que vous comptez investir
              proviennent de sources légales ?
            </label>
            <RadioGroup
              className="flex gap-6 bg-white p-1"
              value={formData.fundsSourceConfirmed ? "yes" : "no"}
              onValueChange={(val) =>
                updateFormData({ fundsSourceConfirmed: val === "yes" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="funds-yes" />
                <Label htmlFor="funds-yes" className="font-normal text-base">
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="funds-no" />
                <Label htmlFor="funds-no" className="font-normal text-base">
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Signature Section */}
        <div className="space-y-2 pt-4">
          <label className="text-sm text-gray-500">
            19. Signature numérique requise pour que la soumission soit complète
          </label>

          <div className="border border-gray-300 rounded-sm bg-[#F0F4F4]">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "w-full h-[200px] rounded-sm",
              }}
              backgroundColor="#F0F4F4"
              onEnd={handleSignatureEnd}
            />
            <div className="border-t border-gray-300 p-2 flex justify-end bg-white rounded-b-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="text-gray-500 hover:text-black text-sm h-auto py-1"
              >
                Effacer
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center pt-1">
            Utilisez votre souris ou votre doigt pour signer ci-dessous
          </p>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            20. Entrez votre nom complet
          </label>
          <Input
            value={formData.signerName || ""}
            onChange={(e) => updateFormData({ signerName: e.target.value })}
            placeholder=""
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base"
          />
        </div>
      </div>

      <div className="flex justify-center gap-32 pt-12 pb-8">
        <Button
          onClick={() => {
            // Handle save logic here if needed
            console.log("Sauvegarder", formData);
          }}
          className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs"
        >
          Sauvegarder
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
