"use client";

import { editTaskWithDocument } from "@/app/actions/tasks/editTaskWithDocument";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentType {
  id: string;
  category: string;
  description: string | null;
  file_format: string;
  file_path?: string | null;
  goal: string;
  document?: {
    id: string;
    name: string;
    created_at: string;
    description?: string | null;
    category?: string | null;
    status?: string | null;
    type?: string | null;
    file_format?: string | null;
    file_path?: string | null;
  } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  doc: DocumentType;
  milestoneId: string;
}

const FILE_ACCEPT_MAP: Record<string, string> = {
  document: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
  image: "image/*",
  video: "video/*",
  audio: "audio/*",
  web: ".html,.htm",
  external: "*/*",
};

export default function EditDocumentModal({
  open,
  onClose,
  doc,
  milestoneId,
}: Props) {
  const [name, setName] = useState(doc?.goal);
  const [category, setCategory] = useState(doc?.category);
  const [description, setDescription] = useState(doc?.description);
  const [fileFormat, setFileFormat] = useState(doc?.file_format);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 20;
  const acceptedTypes = FILE_ACCEPT_MAP[fileFormat ?? "external"];

  function validateFile(file: File) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return "File size must be under 20MB";
    }

    return null;
  }

  useEffect(() => {
    setSelectedFile(null);
  }, [fileFormat]);

  const handleSave = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);

      if (!name || !fileFormat) {
        setUploadError("Nom et format du fichier sont obligatoires");
        return;
      }

      const payload = {
        taskId: doc.id,
        milestoneId: milestoneId,
        name,
        description: description ?? null,
        category: category ?? null,
        file_format: fileFormat ?? null,
        file: selectedFile || undefined,
      };

      const res = await editTaskWithDocument(payload);

      if (!res.success) {
        throw new Error(res.message ?? "Update failed");
      }

      onClose();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 h-9 rounded-xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-span-6">
              <label className="block text-sm font-medium">Catégorie</label>

              <Select value={category} onValueChange={setCategory}>
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
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
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

                <Select value={fileFormat} onValueChange={setFileFormat}>
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
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer
             border-gray-300 bg-gray-50 hover:bg-gray-100
             dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700"
                >
                  {selectedFile ? (
                    // ✅ File selected state
                    <div className="text-center px-4 overflow-hidden max-w-60">
                      <UploadCloud className="w-6 h-6 mb-2 text-green-600 mx-auto" />

                      <p className="text-sm font-medium text-green-700 dark:text-green-400 truncate ">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Cliquez pour changer le fichier
                      </p>
                    </div>
                  ) : (
                    // ⬆️ Default state
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>{" "}
                        ou glisser-déposer
                      </p>
                    </div>
                  )}

                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept={acceptedTypes}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const error = validateFile(file);
                      if (error) {
                        setUploadError(error);
                        return;
                      }

                      setUploadError(null);
                      setSelectedFile(file);
                    }}
                  />
                </label>
                {
                  // Error message
                  uploadError ? (
                    <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">
                      Formats acceptés: {acceptedTypes}
                    </p>
                  )
                }
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
