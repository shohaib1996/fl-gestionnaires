import { getAccountRequests } from "@/app/actions/projects/getAccountRequests";
import UserLIst from "./UserLIst";

export default async function AccountRequestsPage() {
  const result = await getAccountRequests();

  /* -------------------------
     Error state
  -------------------------- */
  if (!result.ok) {
    return (
      <div className="min-h-[72vh] max-h-[72vh]">
        <div className="mt-19.5 border bg-[#E6E6E6] dark:bg-neutral-700 dark:border-neutral-600 py-[13px] px-5">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Demandes de création de compte
          </h1>
        </div>

        <div className="mt-4 bg-card border border-border p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            {result.error ?? "Une erreur est survenue lors du chargement."}
          </p>
        </div>
      </div>
    );
  }

  const requests = result.data ?? [];

  return (
    <div className="min-h-[72vh] max-h-[72vh]">
      {/* Header - Fixed */}
      <div className="mt-19.5 border bg-[#E6E6E6] dark:bg-neutral-700 dark:border-neutral-600 py-[13px] px-5">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          Demandes de création de compte
        </h1>
      </div>

      {/* List - Scrollable */}
      <div className="bg-card border border-border overflow-hidden max-h-[calc(72vh-4rem)] min-h-[calc(72vh-4rem)] overflow-y-auto hide-scrollbar px-8">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white dark:bg-neutral-800 z-10 border-b border-gray-200 dark:border-neutral-700">
            <tr className="text-left">
              <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200">
                Nom
              </th>
              <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200">
                Profession
              </th>
              <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200">
                Email
              </th>
              <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200">
                Téléphone
              </th>
              <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200">
                Statut
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground dark:text-gray-400"
                >
                  Aucune demande trouvée
                </td>
              </tr>
            )}

            {requests.map((req) => (
              <UserLIst key={req.id} req={req} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
