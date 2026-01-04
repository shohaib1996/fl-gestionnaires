"use client";

import { Tables } from "@/types/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type AdminAccountRequest = Tables<"admin_account_requests">;

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminAccountRequest | null;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatIdTypes = (idTypes: string[]) => {
    return idTypes.join(", ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[90vw] rounded-xs p-0 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="bg-[#326EA6] p-6 rounded-t-xs sticky top-0 z-10">
          <DialogTitle className="text-white text-xl font-semibold">
            Détails de l&apos;utilisateur
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Prénom
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.first_name}
                </p>
              </div>

              {user.postnom && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Postnom
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {user.postnom}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nom
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.last_name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date de naissance
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {formatDate(user.birth_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Coordonnées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100 break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Téléphone
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.phone_number}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Adresse
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.address}
                </p>
              </div>
            </div>
          </div>

          {/* ID Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Pièce d&apos;identité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Type(s) de pièce
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {formatIdTypes(user.id_type)}
                </p>
              </div>

              {user.id_number && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Numéro de pièce
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {user.id_number}
                  </p>
                </div>
              )}

              {user.other_id_type && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Autre type de pièce
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {user.other_id_type}
                  </p>
                </div>
              )}
            </div>

            {/* ID Images */}
            {(user.id_front_image || user.id_back_image) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.id_front_image && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                      Recto de la pièce
                    </label>
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-neutral-700 rounded-xs overflow-hidden">
                      <Image
                        src={user.id_front_image}
                        alt="ID Front"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                {user.id_back_image && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                      Verso de la pièce
                    </label>
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-neutral-700 rounded-xs overflow-hidden">
                      <Image
                        src={user.id_back_image}
                        alt="ID Back"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signature Section */}
          {user.signature_url && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Signature
              </h3>
              {user.signer_name && (
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nom du signataire
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {user.signer_name}
                  </p>
                </div>
              )}
              <div className="relative w-full h-32 bg-gray-100 dark:bg-neutral-700 rounded-xs overflow-hidden">
                <Image
                  src={user.signature_url}
                  alt="Signature"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Status & Acceptance Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Statut
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Statut de la demande
                </label>
                <p className="mt-1 text-base">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : user.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {user.status === "approved"
                      ? "Approuvé"
                      : user.status === "rejected"
                      ? "Rejeté"
                      : "En attente"}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conditions acceptées
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.terms_accepted ? "Oui" : "Non"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confidentialité acceptée
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {user.privacy_accepted ? "Oui" : "Non"}
                </p>
              </div>

              {user.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date de création
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-800 p-6 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="w-full bg-[#326EA6] hover:bg-[#326EA6]/90 text-white rounded-xs px-8 h-11 text-base font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
