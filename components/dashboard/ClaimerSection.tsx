"use client";
import { ProjectClaimer } from "@/app/actions/projects/getProjectClaimers";
import { useState } from "react";
import { Button } from "../ui/button";

import { assignProjectToUser } from "@/app/actions/projects/projectAssignment";
import { Project } from "@/app/dashboard/[id]/page";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ClaimerSection({ project }: { project: Project }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedClaimer, setSelectedClaimer] = useState<ProjectClaimer | null>(
    null
  );
  const [assigning, setAssigning] = useState(false);

  const router = useRouter();

  const openAssignConfirm = (claimer: ProjectClaimer) => {
    setSelectedClaimer(claimer);
    setConfirmOpen(true);
  };

  const confirmAssign = async () => {
    console.log("selectedClaimer", selectedClaimer?.id, project.id);
    if (!selectedClaimer?.id || !project.id) return;

    setAssigning(true);

    const res = await assignProjectToUser(
      project.id,
      selectedClaimer.id,
      selectedClaimer.id
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

  const claimers = project.claimers ?? [];

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
          {claimers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No claimers found.
            </p>
          ) : claimers.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun utilisateur n’a encore réclamé ce projet.
            </p>
          ) : (
            claimers.map((claimer, ind) => (
              <div
                key={ind}
                className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-border rounded-xs px-4 py-3"
              >
                {/* Claimer info */}
                <div className="space-y-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {claimer.fullName ?? "Unnamed User"}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {claimer.email}
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
              {selectedClaimer?.user?.fullName ?? "cet utilisateur"}
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
