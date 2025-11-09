"use client";

import { useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, ChevronUp, MenuIcon, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // <— Add this import at the top


export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<"recu" | "retenu" | "encours">(
    "recu"
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm dark:bg-neutral-800">
        <div className="flex items-center gap-3">
          {/* Logo + Text */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/216_1705.png"
              alt="FL Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold text-[#63a053]">Gestionnaires</h1>
          </div>

          {/* Divider line */}
          <div className="h-12 w-px bg-gray-500 dark:bg-neutral-100 mx-2" />

          {/* User avatar */}
          <Image
            src="/images/profile.jpeg"
            alt="User photo"
            width={56}
            height={50}
            className="rounded-full object-cover h-14"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#63a053] h-4 w-4" />
            <Input
              type="text"
              placeholder="Candidat, contact, activité, étiquette...ect"
              className="pl-9 bg-gray-100 border-0 text-sm placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#63a053]"
            />
          </div>
          <Button className="bg-[#63a053] hover:bg-[#528a45] text-white">
            + Ajouter
          </Button>
          <ModeToggle />
          <MenuIcon />
        </div>
      </header>

      <main className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Sidebar */}
        <aside className="w-full max-w-xs rounded-md bg-white p-4 shadow-sm dark:bg-neutral-800">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className=" w-full rounded-md"
          />

          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Tâches
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">11 Mars 2025</p>
                <p className="text-blue-600 dark:text-blue-400 hover:underline">
                  Avocat projet carwash
                </p>
                <p className="text-xs text-gray-500">8:30 - 9:00</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">11 Mars 2025</p>
                <p className="text-blue-600 dark:text-blue-400 hover:underline">
                  Appel pour projet Boisson
                </p>
                <p className="text-xs text-gray-500">9:30 - 10:00</p>
                <p className="text-xs text-gray-500">Notes</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">11 Mars 2025</p>
                <p className="text-blue-600 dark:text-blue-400 hover:underline">
                  Rendez-vous projet eau
                </p>
                <p className="text-xs text-gray-500">8:30 - 9:00</p>
              </div>
            </div>
          </div>

          <Button className="mt-5 w-full bg-[#63a053] hover:bg-[#528a45]">
            + Ajouter
          </Button>
        </aside>

        {/* Main Content */}
        <section className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
            {[
              { key: "recu", label: "Reçus", color: "bg-[#63a053]" },
              { key: "retenu", label: "Retenus", color: "bg-[#63a053]" },
              { key: "encours", label: "En cours", color: "bg-[#63a053]" },
            ].map(({ key, label, color }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`
        min-w-[110px]
        text-white font-medium px-6 py-2 rounded-sm
        transition-all duration-300 ease-in-out
        ${
          activeTab === key
            ? `${color} scale-105 shadow-md`
            : "bg-[#326EA6] text-white hover:bg-[#63a053]"
        }
      `}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
              Filtrer par :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <Input
                  placeholder="Taper ou sélectionner"
                  className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                />
              </div>

              {/* Catégorie */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Catégorie
                </label>
                <Input
                  placeholder="Taper ou sélectionner"
                  className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <Input
                  placeholder="Sélectionner"
                  className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                />
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <Input
                  placeholder="Taper"
                  className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                />
              </div>

              {/* Identifiant FL (IFL) */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Identifiant FL (IFL)
                </label>
                <Input
                  placeholder="Taper"
                  className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab} // Changes when tab changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {{
                  recu: Array.from({ length: 6 }),
                  retenu: Array.from({ length: 6 }),
                  encours: Array.from({ length: 6 }),
                }[activeTab].map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {/* Header */}
                    <div className="bg-[#F3F7FF] px-4 py-2 dark:bg-neutral-700 flex justify-between">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                        {activeTab === "recu"
                          ? "Cola naturelle"
                          : activeTab === "retenu"
                          ? "Projet Boisson"
                          : "Projet Eau"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {activeTab === "recu" ? i + 10 : i + 1}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTab === "recu"
                          ? "Reçu : jeudi 5 Déc 2025"
                          : activeTab === "retenu"
                          ? "Retenu : vendredi 12 Déc 2025"
                          : "En cours : lundi 8 Déc 2025"}
                      </p>
                      <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 leading-snug">
                        {activeTab === "recu"
                          ? "Coca-Cola a été inventé à la fin du 19e siècle par John Stith Pemberton à Atlanta, en Géorgie. été inventé à la fin du 19e siècle par John Stith Pemberton à Atlanta, en Géorgie été inventé à la fin du 19e siècle par John Stith Pemberton à Atlanta, en Géorgie. été inventé à la fin du 19e siècle par John Stith Pemberton à Atlanta, en Géorgie été inventé à la fin du 19e siècle par John Stith Pemberton à Atlanta, en Géorgie."
                          : activeTab === "retenu"
                          ? "Projet de boisson approuvé et en phase de validation finale avant lancement. Projet de boisson approuvé et en phase de validation finale avant lancement Projet de boisson approuvé et en phase de validation finale avant lancement Projet de boisson approuvé et en phase de validation finale avant lancement"
                          : "Projet d’eau en cours de développement, coordination entre les équipes en cours. Projet de boisson approuvé et en phase de validation finale avant lancement Projet de boisson approuvé et en phase de validation finale avant lancement Projet de boisson approuvé et en phase de validation finale avant lancement"}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="text-center text-sm text-gray-500 flex justify-center items-center gap-2">
            <ChevronUp /> 1-20 <ChevronDown />
          </div>
        </section>
        {/* Right Sidebar */}
        <aside className="hidden xl:block w-60 rounded-md bg-white p-4 shadow-sm dark:bg-neutral-800">
          <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Aperçu des projets
          </h3>

          <ul className="space-y-4 text-sm">
            <li className="flex flex-col">
              <span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  105
                </span>{" "}
                projets reçus
              </span>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Cette semaine
              </a>
            </li>

            <li className="flex flex-col">
              <span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  11
                </span>{" "}
                Projets retenus
              </span>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Cette semaine
              </a>
            </li>

            <li className="flex flex-col">
              <span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  6
                </span>{" "}
                Projets en cours
              </span>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Cette semaine
              </a>
            </li>

            <li className="flex flex-col">
              <span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  5
                </span>{" "}
                Projets lancés
              </span>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Cette semaine
              </a>
            </li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
