"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"recu" | "retenu" | "encours">(
    "recu"
  );

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex gap-3 mb-4 shrink-0">
        {[
          { key: "recu", label: "Reçus" },
          { key: "retenu", label: "Retenus" },
          { key: "encours", label: "En cours" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`min-w-[100px] text-white font-medium px-5 py-2 rounded-sm transition-all ${
              activeTab === key
                ? "bg-[#63a053] scale-105 shadow-sm"
                : "bg-[#326EA6] hover:bg-[#63a053]"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 px-13 py-5 rounded-md shadow-sm shrink-0 mb-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-6">
          Filtrer par :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            "Location",
            "Catégorie",
            "Date",
            "Name",
            "Identifiant FL (IFL)",
          ].map((label, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <Input
                placeholder={
                  label === "Date" ? "Sélectionner" : "Taper ou sélectionner"
                }
                className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053] min-w-[180px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-1.5"
            style={{
              maxHeight: "calc(100% - 40px)",
              overflowY: "auto",
              paddingBottom: "8px",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <Link href={`/dashboard/12345678`} key={i}>
                <div className="bg-white dark:bg-neutral-800 shadow-sm flex flex-col rounded-sm border border-gray-200 hover:border-green-400 hover:scale-[0.98] transition-all duration-300 min-h-[242px] min-w-[242px]">
                  <div className="bg-[#F3F7FF] dark:bg-blue-500/20 px-4 py-2 flex justify-between">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      Cola naturelle
                    </h4>
                    <span className="text-xs text-gray-500">{i + 1}</span>
                  </div>
                  <div className="p-4 text-md text-gray-700 dark:text-gray-300">
                    <p className="text-sm text-gray-500 mb-1">
                      Reçu : jeudi 5 Déc 2025
                    </p>
                    Coca-Cola a été inventé à la fin du 19e siècle par John
                    Stith Pemberton à Atlanta, en Géorgie. En 1888, Pemberton a
                    vendu les droits de propriété à Asa Griggs.
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-3 shrink-0">
        <ChevronUp /> 1-20 <ChevronDown />
      </div> */}
    </div>
  );
}
