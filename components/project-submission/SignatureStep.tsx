import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignatureStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SignatureStep: React.FC<SignatureStepProps> = ({
  onNext,
  onPrevious,
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [name, setName] = useState("");

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-black border-b-2 border-[#C8E6C9] pb-1 inline-block">
          Signature
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            16. AVIS IMPORTANT
          </h3>
          <div className="text-sm text-black space-y-4 leading-relaxed">
            <p>
              En soumettant cette candidature, vous confirmez que vous avez lu
              et acceptez les termes ci-dessous, les Conditions d'utilisation de
              ce site web et la Politique de confidentialité de Fond Local, et
              vous déclarez et garantissez que vous remplissez les conditions
              d'éligibilité. Vous reconnaissez également que Fond Local recevra
              les informations personnelles que vous fournissez dans le cadre de
              cette candidature et pourra utiliser ces informations conformément
              à l'avis de confidentialité pour les participants aux programmes
              de Fond Local.
            </p>
            <p>
              En soumettant cette candidature, vous reconnaissez et acceptez que
              celle-ci est envoyée uniquement dans le cadre de l'évaluation par
              Fond Local pour participer à l'un de ses événements de pitch, et
              que vous ne recevrez aucune compensation ou crédit pour cette
              soumission.
            </p>
            <p>
              Si le candidat est un mineur, vous déclarez être son parent ou
              tuteur légal, être autorisé à postuler en son nom et soumettre
              cette candidature en son nom.
            </p>
            <p>
              Vous acceptez et comprenez que votre soumission n'est pas
              confidentielle et ne crée aucune relation de confiance ou relation
              fiduciaire.
            </p>
            <p>
              Vous comprenez que Fond Local peut déjà posséder ou recevoir des
              informations similaires ou identiques à celles contenues dans
              votre soumission, et que toute similarité ne donne droit à aucune
              réclamation, compensation ou crédit.
            </p>
            <p>
              En soumettant une candidature, vous déchargez Fond Local, ainsi
              que ses dirigeants, employés, représentants, licenciés,
              cessionnaires et successeurs, de toute réclamation liée à votre
              soumission, y compris celles découlant d'une mauvaise direction ou
              livraison de votre e-mail.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            17. Signature numérique requise pour que la soumission soit complète
          </label>
          <p className="text-xs text-gray-400">
            Si le candidat est un mineur, le parent ou le tuteur légal doit
            signer
          </p>

          <div className="border border-gray-300 rounded-sm bg-[#F0F4F4]">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "w-full h-[200px] rounded-sm",
              }}
              backgroundColor="#F0F4F4"
            />
            <div className="border-t border-gray-300 p-2 flex justify-end bg-white rounded-b-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="text-gray-500 hover:text-black text-s, h-auto py-1"
              >
                Effacer
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center pt-1">
            Utilisez votre souris ou votre doigt pour signer ci-dessous
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">
            18. Entrez votre nom complet
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet"
            className="bg-[#F0F4F4] border-none h-12 rounded-xs text-base placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-center pt-8 pb-8">
          <Button
            onClick={onNext}
            className="bg-[#5F8E70] hover:bg-[#4d755b] text-white px-12 py-6 text-lg rounded-xs"
          >
            Vérifiez et envoyez
          </Button>
        </div>
      </div>
    </div>
  );
};
