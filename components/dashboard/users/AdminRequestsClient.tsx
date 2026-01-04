"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { approveAdminWithRole } from "@/app/actions/users/approveAdminWithRole";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminAccountRequest = Tables<"admin_account_requests">;

interface AdminRequestsClientProps {
  initialRequests: AdminAccountRequest[];
}

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  super_admin: "Super Admin",
  onterpeoner: "Organisateur",
};

const roleBadgeColors: Record<string, string> = {
  admin: "bg-teal-500 text-white",
  super_admin: "bg-purple-600 text-white",
  onterpeoner: "bg-blue-500 text-white",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

const statusBadgeColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function AdminRequestsClient({
  initialRequests,
}: AdminRequestsClientProps) {
  const [requests, setRequests] =
    useState<AdminAccountRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminAccountRequest | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "super_admin">(
    "admin"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleOpenDialog = (request: AdminAccountRequest) => {
    setSelectedRequest(request);
    setSelectedRole("admin"); // Default to admin
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setIsApproving(true);
    const result = await approveAdminWithRole(selectedRequest.id, selectedRole);

    if (result.ok) {
      toast.success("Rôle mis à jour avec succès!");

      // Update the request in the list with new status and role
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id
            ? ({ ...r, status: "approved", userRole: selectedRole } as any)
            : r
        )
      );

      setIsDialogOpen(false);
    } else {
      toast.error(result.error || "Erreur lors de la mise à jour du rôle");
    }

    setIsApproving(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-500 mt-1">
              Gérer les rôles et permissions des utilisateurs
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            Ajouter un utilisateur
          </Button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800 text-lg">
              Aucune demande de compte administrateur en attente
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {request.first_name?.charAt(0) ||
                                request.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.first_name} {request.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(request as any).userRole ? (
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            roleBadgeColors[(request as any).userRole]
                          }`}
                        >
                          {roleLabels[(request as any).userRole]}
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {request.status === "pending"
                            ? "En attente"
                            : request.status === "rejected"
                            ? "Rejeté"
                            : "Non assigné"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenDialog(request)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.status === "approved"
                ? "Modifier le rôle"
                : "Approuver et assigner un rôle"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.status === "approved"
                ? `Modifier le rôle de ${selectedRequest?.first_name} ${selectedRequest?.last_name}`
                : `Approuver la demande de ${selectedRequest?.first_name} ${selectedRequest?.last_name} et assigner un rôle`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {selectedRequest?.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Téléphone:</strong> {selectedRequest?.phone_number}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Adresse:</strong> {selectedRequest?.address}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Statut:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    statusBadgeColors[selectedRequest?.status || "pending"]
                  }`}
                >
                  {statusLabels[selectedRequest?.status || "pending"]}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un rôle pour cet administrateur
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value: any) => setSelectedRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {selectedRequest?.status === "approved"
                  ? "✓ Cette action mettra à jour le rôle de l'utilisateur existant"
                  : "✓ Cette action créera un compte utilisateur avec le rôle sélectionné"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isApproving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving
                ? "Mise à jour..."
                : selectedRequest?.status === "approved"
                ? "Mettre à jour le rôle"
                : "Approuver et créer l'utilisateur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
