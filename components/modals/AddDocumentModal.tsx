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
      <DialogContent className="p-0 min-w-[30vw] bg-white dark:bg-neutral-900 border-none rounded-none">
        <DialogHeader className="bg-[#326EA6] text-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Document à ajouter
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <label className="text-sm font-medium">Nom*</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nommer le document"
              />
            </div>

            <div className="col-span-6">
              <label className="text-sm font-medium">Catégorie</label>
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">
                    <Scale className="w-4 h-4 mr-2 inline" /> Légal
                  </SelectItem>
                  <SelectItem value="finance">
                    <Landmark className="w-4 h-4 mr-2 inline" /> Finance
                  </SelectItem>
                  <SelectItem value="operations">
                    <Building2 className="w-4 h-4 mr-2 inline" /> Opérations
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <label className="text-sm font-medium">Brève description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="col-span-6">
              <label className="text-sm font-medium">Format du fichier</label>
              <Select onValueChange={setFileFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format du fichier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">
                    <FileText className="w-4 h-4 mr-2 inline" /> Document
                  </SelectItem>
                  <SelectItem value="image">
                    <ImageIcon className="w-4 h-4 mr-2 inline" /> Image
                  </SelectItem>
                  <SelectItem value="video">
                    <PlaySquare className="w-4 h-4 mr-2 inline" /> Vidéo
                  </SelectItem>
                  <SelectItem value="audio">
                    <Music className="w-4 h-4 mr-2 inline" /> Audio
                  </SelectItem>
                  <SelectItem value="web">
                    <Globe2 className="w-4 h-4 mr-2 inline" /> Web
                  </SelectItem>
                  <SelectItem value="external">
                    <Link className="w-4 h-4 mr-2 inline" /> Externe
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4">
            <button onClick={onClose}>Annuler</button>
            <button onClick={handleSave}>Sauvegarder</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
