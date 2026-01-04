import { getAdminAccountRequests } from "@/app/actions/users/getAdminAccountRequests";
import { AdminRequestsClient } from "@/components/dashboard/users/AdminRequestsClient";

export default async function UsersPage() {
  const { requests, error } = await getAdminAccountRequests();

  if (error) {
    return (
      <div className="min-h-[72vh] max-h-[72vh]">
        <div className="mt-19.5 border bg-[#E6E6E6] dark:bg-neutral-700 dark:border-neutral-600 py-[13px] px-5">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Gestion des utilisateurs
          </h1>
        </div>

        <div className="mt-4 bg-card border border-border p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error ?? "Une erreur est survenue lors du chargement."}
          </p>
        </div>
      </div>
    );
  }

  return <AdminRequestsClient initialRequests={requests} />;
}
