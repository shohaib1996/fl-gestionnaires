import {
  getProjectClaimers,
  ProjectClaimer,
} from "@/app/actions/admin/getProjectClaimers";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ClaimerSection({ projectId }: { projectId: string }) {
  const [claimers, setClaimers] = useState<ProjectClaimer[]>([]);
  const [claimersLoading, setClaimersLoading] = useState(true);

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

  return (
    <section className="mt-6 pb-10 bg-card">
      <div className="bg-[#63a053]/25 p-4 mb-6">
        <div className="px-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Claimers{" "}
          </h3>
        </div>
      </div>
      <div className="px-11 py-3 space-y-4">
        {claimersLoading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading claimers...
          </p>
        ) : claimers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No claimers found.</p>
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
                <p className="text-sm text-gray-500">{claimer.claimed_at}</p>
                <p className="text-xs text-gray-400">
                  Claimed on{" "}
                  {new Date(claimer.claimed_at).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {/* Action */}
              <Button
                // disabled={project.assigned_to !== null}
                // onClick={() => assignProject(claimer.user_id)}
                className="bg-[#63A053] hover:bg-[#528a45] text-white rounded-none"
              >
                Assign
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
