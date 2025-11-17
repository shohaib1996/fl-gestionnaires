"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, PlaySquare, Image as ImageIcon, X } from "lucide-react";

interface Phase {
  step: number;
  title: string;
  status: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  phase: Phase;
}

export default function JalonDetailsModal({ open, onClose, phase }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white dark:bg-neutral-900 min-w-[70vw] max-h-[90vh] overflow-auto border-none rounded-none text-gray-800 dark:text-gray-200">
        {/* HEADER */}
        <DialogHeader className="px-8 py-4 bg-[#63A053] dark:bg-[#4e8742] text-white">
          <DialogTitle className="text-lg font-semibold">
            Jalon {phase.step} : {phase.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-10 py-7 space-y-10">
          {/* TOP SECTION GRID */}
          <div className="grid grid-cols-12 gap-8">
            {/* Description */}
            <div className="col-span-6">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">
                Brève description
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Gather and validate all legal documents required for the
                restaurant expansion, including updated business registration,
                operating licenses, and health certificates. Ensure the business
                is fully compliant before moving to the next stage.
              </p>
            </div>

            {/* Date Start */}
            <div className="col-span-2 space-y-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Date de début
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                15 septembre 2026
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">14h00</p>
              <div className="mt-5">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Responsable du jalon
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="/images/profile.jpeg"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Lisa Mimo
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Adviser
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date End */}
            <div className="col-span-2 space-y-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Date butoir
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                25 septembre 2026
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">14h30</p>
            </div>

            {/* Priority + Responsable */}
            <div className="col-span-2 space-y-4">
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Priorités
                </p>
                <p className="text-gray-700 dark:text-gray-300">Normale</p>
              </div>
            </div>
          </div>

          {/* DELIVERABLES SECTION */}
          <div>
            <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">
              Livrables de ce jalon
            </p>

            <div className="grid grid-cols-3 gap-10">
              {[0, 1, 2].map((col) => (
                <div key={col} className="space-y-3">
                  {[FileText, PlaySquare, ImageIcon].map((Icon, idx) => (
                    <div key={idx}>
                      <hr className="border-gray-200 dark:border-neutral-700 mb-1" />
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[#326EA6] dark:text-[#7fb5df]" />
                        </div>
                        <div className="flex gap-7 items-center">
                          <p className="text-sm font-medium text-[#343E47] dark:text-gray-100">
                            Permit document 2025
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Document légal
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER BUTTON */}
          <div className="flex justify-center pt-4">
            <button className="px-6 py-2 bg-[#63A053] dark:bg-[#4e8742] text-white rounded-xs hover:bg-[#528a45] dark:hover:bg-[#3b6c34]">
              Modifier
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
