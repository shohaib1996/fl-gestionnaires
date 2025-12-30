"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "super_admin") {
      setError("Access denied. Only admins can sign in.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#faf9f6] px-6 dark:bg-neutral-900 transition-colors">
      <div className="absolute right-6 top-6">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col items-center">
        <Image
          src="/images/216_1705.png"
          alt="FL FondLocal Logo"
          width={142}
          height={142}
          className="mb-6"
        />

        <p className="text-sm text-gray-400 tracking-wide dark:text-gray-500">
          ADMIN
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full flex flex-col gap-6"
          aria-label="Admin login form"
        >
          {/* Email */}
          <div className="flex h-10 w-full overflow-hidden rounded border border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex h-10 w-10 items-center justify-center bg-gray-200 dark:bg-neutral-700 relative">
              <Image src="/images/218_1738.png" alt="User icon" fill />
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nom d’utilisateur (email)"
              className="h-10 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 focus-visible:ring-0"
              required
            />
          </div>

          {/* Password */}
          <div className="flex h-10 w-full overflow-hidden rounded border border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex h-10 w-10 items-center justify-center bg-gray-200 dark:bg-neutral-700 relative">
              <Image src="/images/218_1741.png" alt="Password icon" fill />
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="h-10 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder=text-gray-500 focus-visible:ring-0"
              required
            />
          </div>

          {error && <div className="text-sm text-red-600 mt-1">{error}</div>}

          <Button
            type="submit"
            className="mt-2 w-48 h-[43px] self-center bg-[#63a053] text-white hover:bg-[#528a45] rounded"
            disabled={loading}
          >
            {loading ? "Connexion..." : "CONNEXION"}
          </Button>
        </form>
      </div>
    </main>
  );
}
