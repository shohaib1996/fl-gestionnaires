"use client";
import {
  getProjectClaimers,
  ProjectClaimer,
} from "@/app/actions/admin/getProjectClaimers";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

import { assignProjectToUser } from "@/app/actions/admin/projectAssignment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ClaimerSection({ projectId }: { projectId: string }) {
  const [claimers, setClaimers] = useState<ProjectClaimer[]>([]);
  const [claimersLoading, setClaimersLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedClaimer, setSelectedClaimer] = useState<ProjectClaimer | null>(
    null
  );
  const [assigning, setAssigning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchClaimers() {
      if (!projectId) return;

      setClaimersLoading(true);

      const result = await getProjectClaimers(projectId);

      if (!result.ok) {
        console.error(result.error);
        setClaimers([]);
        setClaimersLoading(false);
        return;
      }

      setClaimers(result.data ?? []);
      setClaimersLoading(false);
    }

    fetchClaimers();
  }, [projectId]);

  const openAssignConfirm = (claimer: ProjectClaimer) => {
    setSelectedClaimer(claimer);
    setConfirmOpen(true);
  };

  const confirmAssign = async () => {
    if (!selectedClaimer) return;

    setAssigning(true);

    const res = await assignProjectToUser(
      projectId,
      selectedClaimer.user.id,
      selectedClaimer.user.id
    );

    setAssigning(false);
    setConfirmOpen(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.refresh();
  };

  return (
    <>
      <section className="mt-6 pb-10 bg-card">
        <div className="bg-[#63a053]/25 p-4 mb-6">
          <div className="px-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Claimers{" "}
            </h3>
          </div>
        </div>
        <div className="px-11  space-y-4">
          {claimersLoading ? (
            <p className="text-gray-600 dark:text-gray-300">
              Loading claimers...
            </p>
          ) : claimers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No claimers found.
            </p>
          ) : claimers.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun utilisateur n’a encore réclamé ce projet.
            </p>
          ) : (
            claimers.map((claimer) => (
              <div
                key={claimer.id}
                className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-border rounded-xs px-4 py-3"
              >
                {/* Claimer info */}
                <div className="space-y-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {claimer.user.fullName ?? "Unnamed User"}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {claimer.user.email}
                  </p>

                  <p className="text-xs text-gray-400">
                    Claimed on{" "}
                    {new Date(claimer.claimed_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {/* Action */}
                <Button
                  onClick={() => openAssignConfirm(claimer)}
                  className="bg-[#63A053] hover:bg-[#528a45] text-white rounded-none"
                >
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Assigner ce projet ?"
        description={
          <>
            Vous êtes sur le point d’assigner ce projet à{" "}
            <span className="font-semibold">
              {selectedClaimer?.user.fullName ?? "cet utilisateur"}
            </span>
            .
          </>
        }
        loading={assigning}
        onConfirm={confirmAssign}
      />
    </>
  );
}
