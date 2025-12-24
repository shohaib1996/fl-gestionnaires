"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

const UserLoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      /* ------------------------------------
       * 1. Check public.users (role check)
       * ------------------------------------ */
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        toast.error("Aucun compte trouvé avec cet email");
        return;
      }

      if (user.role !== "onterpeoner") {
        toast.error("Accès non autorisé pour ce compte");
        return;
      }

      /* ------------------------------------
       * 2. Sign in with Supabase Auth
       * ------------------------------------ */
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error("Email ou mot de passe incorrect");
      }

      /* ------------------------------------
       * 3. Success
       * ------------------------------------ */
      toast.success("Connexion réussie");
      router.replace("/user");
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex">
      {/* Mobile Background */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src="/images/Rectangle 660.png"
          alt="Background"
          fill
          className="object-fill"
          priority
        />
      </div>

      {/* Left Pane (Desktop) */}
      <div className="hidden md:flex md:w-1/2 relative flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Rectangle 660.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-center h-full">
          <div className="relative w-40 h-40 mb-6 mt-28">
            <Image
              src="/images/FL FondLocal.svg"
              alt="FL Fond Local"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-white text-sm tracking-widest font-medium uppercase mt-8">
            FOND LOCAL
          </h1>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="relative z-10 min-h-dvh w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:bg-[#FAF9F6]">
        {/* Mobile Logo */}
        <div className="flex md:hidden flex-col items-center mb-12 mt-24">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src="/images/FL FondLocal.svg"
              alt="FL Fond Local"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-white text-sm tracking-widest font-medium uppercase">
            FOND LOCAL
          </h1>
        </div>

        <div className="w-full max-w-md space-y-8">
          <h2 className="text-[#63A053] text-3xl font-medium text-center">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white md:text-gray-500 text-sm ml-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 bg-[#F5F5F5] border-none text-black rounded-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white md:text-gray-500 text-sm ml-1">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-12 bg-[#F5F5F5] border-none text-black rounded-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#63A053] hover:bg-[#528644] text-white text-lg font-medium rounded-xs"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
