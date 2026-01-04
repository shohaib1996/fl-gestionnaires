import { getAdminAccountRequests } from "@/app/actions/users/getAdminAccountRequests";
import { AdminRequestsClient } from "@/components/dashboard/users/AdminRequestsClient";

export default async function UsersPage() {
  const { requests, error } = await getAdminAccountRequests();

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminRequestsClient initialRequests={requests} />
    </div>
  );
}
