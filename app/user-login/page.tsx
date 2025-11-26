import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserLoginPage = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Mobile Background (Visible only on mobile) */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src="/images/Rectangle 660.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Left Pane (Desktop/Tablet only) */}
      <div className="hidden md:flex md:w-1/2 relative flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Rectangle 660.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay to match the design tint */}
          {/* <div className="absolute inset-0 bg-[#4A5D52]/80 mix-blend-multiply" /> */}
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
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:bg-white">
        {/* Mobile Logo (Visible only on mobile) */}
        <div className="flex md:hidden flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-2">
            <Image
              src="/images/FL FondLocal.svg"
              alt="FL Fond Local"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-white text-lg tracking-widest font-medium uppercase">
            FOND LOCAL
          </h1>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-[#63A053] text-3xl md:text-4xl font-bold mb-2">
              Demandez un compte
            </h2>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/90 md:text-gray-500 text-sm md:text-base ml-1">
                Nom et prénom
              </label>
              <Input
                type="text"
                placeholder="Nom et prénom"
                className="h-12 bg-[#F5F5F5] border-none text-black placeholder:text-gray-400 rounded-sm text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/90 md:text-gray-500 text-sm md:text-base ml-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Votre email"
                className="h-12 bg-[#F5F5F5] border-none text-black placeholder:text-gray-400 rounded-sm text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/90 md:text-gray-500 text-sm md:text-base ml-1">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="Votre mot de passe"
                className="h-12 bg-[#F5F5F5] border-none text-black placeholder:text-gray-400 rounded-sm text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/90 md:text-gray-500 text-sm md:text-base ml-1">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                placeholder="Confirmer votre mot de passe"
                className="h-12 bg-[#F5F5F5] border-none text-black placeholder:text-gray-400 rounded-sm text-base"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-[#63A053] hover:bg-[#528644] text-white text-lg font-medium rounded-md transition-colors"
              >
                Connexion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
