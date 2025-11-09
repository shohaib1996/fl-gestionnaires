"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Demo credentials (client-side only)
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    // simulate small delay to improve UX
    await new Promise((r) => setTimeout(r, 350));

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Optionally set a lightweight flag so Dashboard can check (NOT secure)
      // localStorage token example:
      if (typeof window !== "undefined") {
        localStorage.setItem("fd_demo_auth", "true");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#faf9f6] px-6 dark:bg-neutral-900 transition-colors">
      {/* Mode Toggle - Top Right */}
      <div className="absolute right-6 top-6">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col items-center">
        {/* Logo */}
        <Image
          src="/images/216_1705.png"
          alt="FL FondLocal Logo"
          width={142}
          height={142}
          className="mb-6"
        />

        {/* Label */}
        <p className="text-sm text-gray-400 tracking-wide dark:text-gray-500">
          ADMIN
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full flex flex-col gap-4"
          aria-label="Admin login form"
        >
          {/* Email */}
          <div className="flex h-10 w-full overflow-hidden rounded border border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex h-10 w-10 items-center justify-center bg-gray-200 dark:bg-neutral-700">
              <Image
                src="/images/218_1738.png"
                alt="User icon"
                width={20}
                height={20}
              />
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nom d’utilisateur (email)"
              className="h-10 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
              aria-label="Email"
            />
          </div>

          {/* Password */}
          <div className="flex h-10 w-full overflow-hidden rounded border border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex h-10 w-10 items-center justify-center bg-gray-200 dark:bg-neutral-700">
              <Image
                src="/images/218_1741.png"
                alt="Password icon"
                width={20}
                height={20}
              />
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="h-10 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              required
              aria-label="Password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 mt-1" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="mt-2 w-48 self-center bg-[#63a053] text-white hover:bg-[#528a45]"
            disabled={loading}
          >
            {loading ? "Connexion..." : "CONNEXION"}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="#"
            className="text-xs text-gray-600 opacity-75 hover:opacity-100 hover:underline dark:text-gray-300"
          >
            Mot de passe oublié ?
          </Link>
          <Link
            href="#"
            className="text-xs text-gray-600 opacity-75 hover:opacity-100 hover:underline dark:text-gray-300"
          >
            Nom d&apos;utilisateur oublié ?
          </Link>
        </div>
      </div>
    </main>
  );
}
