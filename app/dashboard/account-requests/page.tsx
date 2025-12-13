import { getAccountRequests } from "@/app/actions/admin/getAccountRequests";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AccountRequestsPage() {
  const requests = await getAccountRequests();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold text-foreground">Account Requests</h1>
        <p className="text-sm text-muted-foreground">
          Liste des demandes de création de compte
        </p>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xs overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Profession</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Action</th>
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
              <tr
                key={req.id}
                className="border-t border-border hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">
                  {req.first_name} {req.last_name}
                </td>
                <td className="px-4 py-3">{req.email}</td>
                <td className="px-4 py-3">{req.phone_number}</td>
                <td className="px-4 py-3">{req.occupation}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/account-requests/${req.id}`}
                    className="text-primary hover:underline"
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Status Badge                        */
/* ---------------------------------- */
function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-primary text-primary-foreground">Approuvée</Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejetée</Badge>;
    default:
      return <Badge variant="secondary">En attente</Badge>;
  }
}
