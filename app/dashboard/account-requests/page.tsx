import { getAccountRequests } from "@/app/actions/projects/getAccountRequests";
import UserLIst from "./UserLIst";

export default async function AccountRequestsPage() {
  const result = await getAccountRequests();

  /* -------------------------
     Error state
  -------------------------- */
  if (!result.ok) {
    return (
      <div className="p-6">
        <div className="mt-10 bg-[#E6E6E6]">
          <h1 className="text-2xl font-bold text-foreground">
            Demandes de création de compte
          </h1>
        </div>

        <div className="mt-10 bg-card border border-border rounded-xs p-8 text-center">
          <p className="text-sm text-red-600">
            {result.error ?? "Une erreur est survenue lors du chargement."}
          </p>
        </div>
      </div>
    );
  }

  const requests = result.data ?? [];

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="mt-12 border border-[#E6E6E6] py-[13px] px-3.5">
        <h1 className="text-2xl font-bold text-foreground">
          Demandes de création de compte
        </h1>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xs overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Profession</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
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
