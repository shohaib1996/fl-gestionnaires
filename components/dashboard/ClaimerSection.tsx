"use client";

import { Claimer } from "@/app/actions/projects/projects.action";

export default function ClaimerSection({ claimer }: { claimer: Claimer }) {
  return (
    <section className="mt-6 pb-10 bg-card">
      <div className="bg-[#63a053]/25 p-4 mb-6">
        <div className="px-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Claimer
          </h3>
        </div>
      </div>

      <div className="px-11">
        {!claimer ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Aucun utilisateur n’a encore réclamé ce projet.
          </p>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-border rounded-xs px-4 py-3">
            {/* Claimer info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-800 dark:text-white">
                {claimer.fullName || "Unnamed User"}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {claimer.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
