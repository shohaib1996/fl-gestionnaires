"use client";

import { logoutAction } from "@/app/auth/actions";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const queryClient = useQueryClient();

  return (
    <button
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
      Se déconnecter
    </button>
  );
}
