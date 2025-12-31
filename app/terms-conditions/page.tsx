"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-foreground flex flex-col">
      <header className="px-4 lg:px-0 pt-5 lg:pt-[3.5vh]">
        <div className="max-w-7xl xl:container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/216_1705.png"
                alt="FL Logo"
                width={125}
                height={100}
              />
            </Link>

            <div className="hidden lg:flex justify-between items-center flex-2 w-full ml-8 lg:ml-5">
              <nav className="flex items-center gap-6 text-lg font-medium text-muted-foreground">
                <Link href="#" className="hover:text-foreground">
                  FOND LOCAL
                </Link>
                <div className="h-12 w-px bg-black/50" />
                <Link href="#" className="hover:text-foreground">
                  Soumission de Projet
                </Link>
              </nav>
            </div>

            <div className="lg:hidden flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11">
                    <Menu className="size-9" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-8 p-5">
                    <nav className="flex flex-col gap-4 text-lg font-medium text-muted-foreground">
                      <Link href="#" className="hover:text-foreground">
                        La une
                      </Link>
                      <Link href="#" className="hover:text-foreground">
                        Rapport du marché
                      </Link>
                    </nav>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <div className="bg-primary p-0.5 rounded-sm">
                          <Search className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                      <Input
                        type="text"
                        placeholder="Recherche"
                        className="pl-12 text-lg rounded-xs bg-secondary border-none h-9 focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                      />
                    </div>
                    <Link
                      href="/login"
                      className="text-lg font-medium text-muted-foreground hover:text-foreground"
                    >
                      Connexion
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-12">
          Conditions générales d'utilisation
        </h1>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-bold mb-2">1. Introduction</h2>
            <p>
              Bienvenue sur Fond Local (le "Site"). En accédant ou en utilisant
              notre Site, vous acceptez de vous conformer aux présentes
              Conditions générales d'utilisation (les "Conditions"). Si vous
              n'acceptez pas ces Conditions, veuillez ne pas utiliser le Site.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">2. Utilisation du Site</h2>
            <p>
              Vous acceptez d'utiliser le Site conformément aux lois et
              règlements en vigueur. Vous ne devez pas utiliser le Site de
              manière frauduleuse ou en vue de commettre une activité illégale.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">3. Inscription et Compte</h2>
            <p>
              Pour accéder à certains services, vous devrez créer un compte.
              Vous acceptez de fournir des informations exactes et à jour lors
              de votre inscription. Vous êtes responsable de la sécurité de
              votre compte et de toutes les activités qui y sont associées.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">
              4. Investissement et Conseils Financiers
            </h2>
            <p>
              Fond Local fournit des informations sur les opportunités
              d'investissement, mais ne donne pas de conseils financiers
              personnalisés. Les informations fournies sur le Site sont à titre
              informatif seulement. Vous devez consulter un conseiller financier
              professionnel avant de prendre toute décision d'investissement.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">5. Confidentialité</h2>
            <p>
              Votre confidentialité est importante pour nous. Veuillez consulter
              notre Politique de confidentialité pour en savoir plus sur la
              manière dont nous collectons, utilisons et protégeons vos
              informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">6. Propriété Intellectuelle</h2>
            <p>
              Tout le contenu du Site, y compris les textes, graphiques, logos,
              images, et logiciels, est la propriété de Fond Local ou de ses
              concédants de licence et est protégé par les lois sur le droit
              d'auteur et autres lois de propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">7. Limitation de Responsabilité</h2>
            <p>
              Fond Local ne sera pas responsable des dommages indirects,
              spéciaux, consécutifs ou punitifs découlant de votre utilisation
              du Site. Nous ne garantissons pas que le Site sera disponible de
              manière ininterrompue, sécurisée ou sans erreur.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">8. Modification des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces Conditions à tout
              moment. Toute modification sera effective dès sa publication sur
              le Site. Il est de votre responsabilité de consulter régulièrement
              les Conditions pour être informé de tout changement.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">9. Résiliation</h2>
            <p>
              Nous nous réservons le droit de résilier ou de suspendre votre
              accès au Site sans préavis si vous enfreignez ces Conditions ou si
              nous avons des raisons de croire que votre utilisation du Site est
              frauduleuse ou illégale.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">10. Contact</h2>
            <p>
              Si vous avez des questions concernant ces Conditions, veuillez
              nous contacter à
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
