import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotInvitedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl bg-card rounded-xs border border-border shadow-sm p-8 md:p-12 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/216_1705.png"
            alt="Fond Local"
            width={110}
            height={90}
            className="w-24 h-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Accès restreint
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          Cette page est accessible uniquement via une invitation officielle de
          <span className="font-medium text-foreground"> Fond Local</span>.
          <br />
          Si vous avez reçu une invitation, veuillez utiliser le lien fourni
          dans votre e-mail.
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-border mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="rounded-xs px-6 py-2">
              Retour à l’accueil
            </Button>
          </Link>

          <Link href="/login">
            <Button className="rounded-xs px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
