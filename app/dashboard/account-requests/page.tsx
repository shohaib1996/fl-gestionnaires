import { getAccountRequests } from "@/app/actions/projects/getAccountRequests";
import UserLIst from "./UserLIst";
import Link from "next/link";

export default async function AccountRequestsPage() {
  const result = await getAccountRequests();

  /* -------------------------
     Error state
  -------------------------- */
  if (!result.ok) {
    return (
      <div className="">
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
    <div className="">
      {/* Back Button */}
      <div className="py-6.5">
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
      </div>
      <div className="h-[72vh] border border-[#000000]/15 flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-[#E6E6E6] dark:bg-neutral-700 dark:border-neutral-600 py-[13px] px-5 shrink-0">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Demandes de création de compte
          </h1>
        </div>

        {/* List - Scrollable */}
        <div className="bg-card border border-border overflow-hidden flex-1 overflow-y-auto hide-scrollbar px-10 pb-8">
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
                <th className="px-6 py-3 font-normal text-gray-900 dark:text-gray-200 text-center">
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
    </div>
  );
}
