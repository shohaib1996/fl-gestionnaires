"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ChevronDown,
  X,
} from "lucide-react";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddDocumentModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[30vw] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-none rounded-none">
        {/* Header */}
        <DialogHeader className="bg-[#326EA6] text-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Document à ajouter
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Name */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Nom*</label>
              <Input
                placeholder="Nommer  le document"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Catégorie</label>

              <Select>
                <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-xs">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="legal" className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-[#326EA6]" /> Légal
                  </SelectItem>
                  <SelectItem value="finance" className="flex items-center gap-3">
                    <Landmark className="w-5 h-5 text-[#326EA6]" /> Finance
                  </SelectItem>
                  <SelectItem value="operations" className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-[#326EA6]" /> Opérations
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Description */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Brève description</label>
              <Textarea
                placeholder="Brève description"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-24 rounded-xs"
              />
            </div>

            {/* File Format Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Format du fichier</label>

              <Select>
                <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xs px-3 py-2 text-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Format du fichier" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="document" className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#326EA6]" /> Document
                  </SelectItem>
                  <SelectItem value="image" className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-[#326EA6]" /> Image
                  </SelectItem>
                  <SelectItem value="video" className="flex items-center gap-3">
                    <PlaySquare className="w-5 h-5 text-[#326EA6]" /> Vidéo
                  </SelectItem>
                  <SelectItem value="audio" className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-[#326EA6]" /> Audio
                  </SelectItem>
                  <SelectItem value="web" className="flex items-center gap-3">
                    <Globe2 className="w-5 h-5 text-[#326EA6]" /> Page web
                  </SelectItem>
                  <SelectItem value="external" className="flex items-center gap-3">
                    <Link className="w-5 h-5 text-[#326EA6]" /> Fichier externe
                  </SelectItem>
                </SelectContent>
              </Select>
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
