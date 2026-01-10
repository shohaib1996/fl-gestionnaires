"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { approveAdminWithRole } from "@/app/actions/users/approveAdminWithRole";
import { getAdminAccountRequests } from "@/app/actions/users/getAdminAccountRequests";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDetailsModal } from "./UserDetailsModal";
import Link from "next/link";

type AdminAccountRequest = Tables<"admin_account_requests">;

interface AdminRequestsClientProps {
  initialRequests: AdminAccountRequest[];
}

const roleLabels: Record<string, string> = {
  admin: "Chef de file",
  super_admin: "Allié",
  onterpeoner: "Organisateur",
};

const roleBadgeColors: Record<string, string> = {
  admin: "bg-[#239E98] text-white",
  super_admin: "bg-[#417EDA] text-white",
  onterpeoner: "bg-[#2E586D] text-white",
};

export function AdminRequestsClient({
  initialRequests,
}: AdminRequestsClientProps) {
  const [requests, setRequests] =
    useState<AdminAccountRequest[]>(initialRequests);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminAccountRequest | null>(
    null
  );
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const { requests: searchResults } = await getAdminAccountRequests(
        searchQuery
      );
      setRequests(searchResults);
      setIsSearching(false);
    }, 500); // 500ms debounce (0.5 seconds)

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRoleChange = async (
    request: AdminAccountRequest,
    newRole: "admin" | "super_admin" | "onterpeoner"
  ) => {
    setIsUpdating(true);
    setOpenDropdownId(null);

    // Show loading toast
    toast.loading("Mise à jour du rôle en cours...");

    const result = await approveAdminWithRole(request.id, newRole);

    // Dismiss loading toast
    toast.dismiss();

    if (result.ok) {
      toast.success("Rôle mis à jour avec succès!");

      // Update the request in the list with new status and role
      setRequests(
        requests.map((r) =>
          r.id === request.id
            ? ({ ...r, status: "approved", userRole: newRole } as any)
            : r
        )
      );
    } else {
      toast.error(result.error || "Erreur lors de la mise à jour du rôle");
    }

    setIsUpdating(false);
  };

  const handleAddUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // TODO: Implement the server action to send invitation email
    toast.success("Invitation envoyée avec succès!");
    setIsAddUserDialogOpen(false);
    setNewUserName("");
    setNewUserEmail("");
  };

  const handleRowClick = (request: AdminAccountRequest) => {
    setSelectedUser(request);
    setIsUserDetailsModalOpen(true);
  };

  return (
    <>
      {/* Top Bar - Back button, Search, and Add Button */}
      <div className="py-5 flex justify-between items-center gap-4">
        {/* Back Button */}
        <Link href="/dashboard">
          <button className="p-2 rounded-xs bg-[#326EA6] hover:bg-[#326EA6]/80 text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="11"
              viewBox="0 0 13 11"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 10.9469C11.4097 9.01439 9.99743 7.91784 8.7633 7.65729C7.52917 7.39675 6.35418 7.35738 5.23835 7.53921V11L0 5.35279L5.23835 0V3.28932C7.30167 3.3055 9.0558 4.04239 10.5007 5.5C11.9455 6.95761 12.7786 8.77325 13 10.9469Z"
                fill="white"
              />
            </svg>
          </button>
        </Link>

        <div className="flex justify-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 rounded-xs pr-4 py-2 border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#63A053]"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={() => setIsAddUserDialogOpen(true)}
            className="bg-[#63A053] hover:bg-[#528a45] text-white whitespace-nowrap rounded-xs"
          >
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-125 w-[90vw] rounded-xs p-0">
          <DialogHeader className="bg-[#326EA6] p-6 rounded-t-xs">
            <DialogTitle className="text-white text-xl font-semibold">
              Ajouter un utilisateur
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-base font-normal text-gray-900 dark:text-gray-100"
              >
                Nom*
              </Label>
              <Input
                id="name"
                placeholder="Nom du nouvel utilisateur"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-[#EBEBEB] border-gray-300 rounded-xs h-12 text-base placeholder:text-gray-400 focus-visible:ring-[#326EA6]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-normal text-gray-900 dark:text-gray-100"
              >
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email du nouvel utilisateur"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="bg-[#EBEBEB] border-gray-300 rounded-xs h-12 text-base placeholder:text-gray-400 focus-visible:ring-[#326EA6]"
              />
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Une invitation sera envoyée par email afin de permettre à
              l'utilisateur de finaliser la création de son compte.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={() => {
                  setIsAddUserDialogOpen(false);
                  setNewUserName("");
                  setNewUserEmail("");
                }}
                className="bg-[#326EA6] hover:bg-[#326EA6]/90 text-white rounded-xs px-8 h-11 text-base font-medium"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-[#326EA6] hover:bg-[#326EA6]/90 text-white rounded-xs px-8 h-11 text-base font-medium"
              >
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content Container */}
      <div className="h-[72vh] border border-[#000000]/15 rounded-xs flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-[#E6E6E6] dark:bg-neutral-700 dark:border-neutral-600 py-[13px] px-5 shrink-0">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Gestion des utilisateurs
          </h1>
        </div>

        {/* Table - Scrollable */}
        <div className="bg-card overflow-hidden flex-1 overflow-y-auto hide-scrollbar px-8">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white dark:bg-neutral-800 z-10 border-b border-gray-200 dark:border-neutral-700">
              <tr className="text-left font-bold">
                <th className="px-6 py-3 text-gray-900 dark:text-gray-200">
                  Nom
                </th>
                <th className="px-6 py-3 text-gray-900 dark:text-gray-200">
                  Rôle
                </th>
                <th className="px-6 py-3 text-gray-900 dark:text-gray-200">
                  Email
                </th>
                <th className="px-6 py-3 text-gray-900 dark:text-gray-200">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {isSearching && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground dark:text-gray-400"
                  >
                    Recherche en cours...
                  </td>
                </tr>
              )}

              {!isSearching && requests.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground dark:text-gray-400"
                  >
                    {searchQuery.trim()
                      ? "Aucun résultat trouvé pour votre recherche"
                      : "Aucune demande trouvée"}
                  </td>
                </tr>
              )}

              {!isSearching &&
                requests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleRowClick(request)}
                    className="border-t border-gray-200 dark:border-neutral-700 hover:bg-[#E0EFFF] dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-neutral-600 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                              {request.first_name?.charAt(0) ||
                                request.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-normal text-gray-900 dark:text-gray-100">
                            {request.first_name} {request.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {(request as any).userRole ? (
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            roleBadgeColors[(request as any).userRole]
                          }`}
                        >
                          {roleLabels[(request as any).userRole]}
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-600 dark:text-gray-200">
                          {request.status === "pending"
                            ? "En attente"
                            : request.status === "rejected"
                            ? "Rejeté"
                            : "Non assigné"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-normal text-gray-700 dark:text-gray-300">
                      {request.email}
                    </td>
                    <td className="px-6 py-3">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(
                              openDropdownId === request.id ? null : request.id
                            );
                          }}
                          disabled={isUpdating}
                          className="text-[#343E47] hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 disabled:opacity-50"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Modifier le rôle
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === request.id && (
                          <>
                            {/* Backdrop to close dropdown */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                              }}
                            />
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg z-20"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() =>
                                    handleRoleChange(request, "onterpeoner")
                                  }
                                  disabled={isUpdating}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="w-3 h-3 rounded-full bg-[#2E586D]"></span>
                                  Organisateur
                                </button>
                                <button
                                  onClick={() =>
                                    handleRoleChange(request, "admin")
                                  }
                                  disabled={isUpdating}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="w-3 h-3 rounded-full bg-[#239E98]"></span>
                                  Chef de file
                                </button>
                                <button
                                  onClick={() =>
                                    handleRoleChange(request, "super_admin")
                                  }
                                  disabled={isUpdating}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="w-3 h-3 rounded-full bg-[#417EDA]"></span>
                                  Allié
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => {
          setIsUserDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
}
