"use client";

import { logoutAction } from "@/app/auth/actions";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const queryClient = useQueryClient();

  return (
    <button
      className="text-[#343E47] dark:text-gray-200"
      onClick={async () => {
        try {
          queryClient.clear();
          await logoutAction();
        } finally {
          // Force hard reload to clear all client state
          window.location.href = "/login";
        }
      }}
    >
      Déconnexion
    </button>
  );
}
