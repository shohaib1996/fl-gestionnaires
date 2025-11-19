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
  Scale,
  Landmark,
  Building2,
  FileText,
  Image as ImageIcon,
  PlaySquare,
  Music,
  Globe2,
  Link,
  UploadCloud,
} from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  // In a real app, you'd pass the document data here to pre-fill
  // document?: DocumentType;
}

export default function EditDocumentModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[30vw] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-none rounded-none">
        {/* Header */}
        <DialogHeader className="bg-[#326EA6] text-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Modifier le document
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Name */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Nom*</label>
              <Input
                placeholder="Nommer le document"
                defaultValue="Permit document 2025" // Example pre-filled
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Catégorie</label>

              <Select defaultValue="legal">
                <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-xs">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="legal" className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#326EA6]" /> Légal
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="finance"
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-[#326EA6]" /> Finance
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="operations"
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#326EA6]" />{" "}
                      Opérations
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Description */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">
                Brève description
              </label>
              <Textarea
                placeholder="Brève description"
                defaultValue="Document légal pour le projet..." // Example pre-filled
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-24 rounded-xs"
              />
            </div>

            {/* Right Column: Format + Upload */}
            <div className="col-span-6 space-y-6">
              {/* File Format Dropdown */}
              <div>
                <label className="block text-sm font-medium">
                  Format du fichier
                </label>

                <Select defaultValue="document">
                  <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xs px-3 py-2 text-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="Format du fichier" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900">
                    <SelectItem value="document">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#326EA6]" /> Document
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#326EA6]" /> Image
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <PlaySquare className="w-5 h-5 text-[#326EA6]" /> Vidéo
                      </div>
                    </SelectItem>
                    <SelectItem value="audio">
                      <div className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-[#326EA6]" /> Audio
                      </div>
                    </SelectItem>
                    <SelectItem value="web">
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-5 h-5 text-[#326EA6]" /> Page web
                      </div>
                    </SelectItem>
                    <SelectItem value="external">
                      <div className="flex items-center gap-2">
                        <Link className="w-5 h-5 text-[#326EA6]" /> Fichier
                        externe
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Télécharger un fichier
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-neutral-800 hover:bg-gray-100 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>{" "}
                        ou glisser-déposer
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#326EA6] text-white rounded hover:bg-[#255583]"
            >
              Annuler
            </button>

            <button className="px-6 py-2 bg-[#326EA6] text-white rounded hover:bg-[#255583]">
              Sauvegarder
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
