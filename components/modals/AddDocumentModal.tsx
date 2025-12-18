"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddDocumentPayload } from "@/types/task";
import {
  Building2,
  FileText,
  Globe2,
  Image as ImageIcon,
  Landmark,
  Link,
  Music,
  PlaySquare,
  Scale,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDocumentPayload) => void;
}

export default function AddDocumentModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [fileFormat, setFileFormat] = useState("");

  const handleSave = () => {
    onSubmit({
      name,
      category,
      description,
      file_format: fileFormat,
    });

    // optional: reset locally
    setName("");
    setCategory(null);
    setDescription("");
    setFileFormat("");
  };

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nommer le document"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Catégorie</label>

              <Select onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-xs">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="legal">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-[#326EA6]" /> Légal
                    </div>
                  </SelectItem>

                  <SelectItem value="finance">
                    <div className="flex items-center gap-3">
                      <Landmark className="w-5 h-5 text-[#326EA6]" /> Finance
                    </div>
                  </SelectItem>

                  <SelectItem value="operations">
                    <div className="flex items-center gap-3">
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brève description"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-24 rounded-xs"
              />
            </div>

            {/* File Format Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">
                Format du fichier
              </label>

              <Select onValueChange={(v) => setFileFormat(v)}>
                <SelectTrigger className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xs px-3 py-2 text-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Format du fichier" />
                </SelectTrigger>

                <SelectContent className="bg-white dark:bg-neutral-900">
                  <SelectItem value="document">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#326EA6]" /> Document
                    </div>
                  </SelectItem>

                  <SelectItem value="image">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-[#326EA6]" /> Image
                    </div>
                  </SelectItem>

                  <SelectItem value="video">
                    <div className="flex items-center gap-3">
                      <PlaySquare className="w-5 h-5 text-[#326EA6]" /> Vidéo
                    </div>
                  </SelectItem>

                  <SelectItem value="audio">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-[#326EA6]" /> Audio
                    </div>
                  </SelectItem>

                  <SelectItem value="web">
                    <div className="flex items-center gap-3">
                      <Globe2 className="w-5 h-5 text-[#326EA6]" /> Page web
                    </div>
                  </SelectItem>

                  <SelectItem value="external">
                    <div className="flex items-center gap-3">
                      <Link className="w-5 h-5 text-[#326EA6]" /> Fichier
                      externe
                    </div>
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

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#326EA6] text-white rounded hover:bg-[#255583]"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
