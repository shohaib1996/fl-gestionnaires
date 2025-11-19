"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  User,
  Briefcase,
  MapPin,
  Mail,
  Award,
  Phone,
} from "lucide-react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddContactModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[30vw] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-none rounded-none">
        {/* Header */}
        <DialogHeader className="bg-[#326EA6] text-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Ajouter un contact
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Row 1: Name & Title */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom*</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Nom complet"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Ex: Architecte"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 3: City & Skills */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Ville de résidence"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Compétences
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Ex: Architect, Landscaping"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Bio & Image Upload */}
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Biographie
              </label>
              <Textarea
                placeholder="Brève description ou biographie..."
                className="bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-32 rounded-xs resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Photo de profil
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="contact-image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-neutral-800 hover:bg-gray-100 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-2">
                      <span className="font-semibold">
                        Cliquez pour télécharger
                      </span>
                    </p>
                  </div>
                  <input
                    id="contact-image-upload"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 border cursor-pointer border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              Annuler
            </button>

            <button className="px-6 py-2 cursor-pointer bg-[#326EA6] text-white rounded hover:bg-[#255583] transition">
              Ajouter
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
