"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadLogo } from "@/app/actions/upload-logo";
import { createContact } from "@/app/actions/createContact";

import {
  UploadCloud,
  User,
  Briefcase,
  MapPin,
  Mail,
  Award,
  Phone,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddContactModal({ open, onClose }: Props) {
  // ⭐ State fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ⭐ Handler for Add button
  const handleAddContact = async () => {
    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }

    let imageUrl = null;
    let imagePath = null;

    if (imageFile) {
      const uploaded = await uploadLogo(imageFile); // ⭐ using your function

      if (uploaded.error) {
        alert("Image upload failed: " + uploaded.error);
        return;
      }

      imageUrl = uploaded.url;
      imagePath = uploaded.path;
    }

    const contact = {
      name,
      title,
      email,
      phone,
      city,
      skills,
      bio,
      imageUrl,
      imagePath,
    };

    console.log("📇 Creating contact:", contact);

    const result = await createContact(contact);

    if (result.error) {
      alert("❌ Failed to create contact: " + result.error);
      return;
    }

    console.log("✅ Contact created:", result.data);

    // Reset
    setName("");
    setTitle("");
    setEmail("");
    setPhone("");
    setCity("");
    setSkills("");
    setBio("");
    setImageFile(null);

    // Close modal
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[30vw] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-none rounded-none">
        <DialogHeader className="bg-[#326EA6] text-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Ajouter un contact
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom*</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom complet"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Architecte"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Compétences
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Ex: Architecture, Planning"
                  className="pl-9 bg-gray-50 dark:bg-neutral-800 h-9 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium mb-1">
                Biographie
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brève description..."
                className="bg-gray-50 dark:bg-neutral-800 h-32 rounded-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Photo de profil
              </label>

              <label
                htmlFor="contact-image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-neutral-800"
              >
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-semibold">
                    Cliquez pour télécharger
                  </span>
                </p>

                <input
                  id="contact-image-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              Annuler
            </button>

            <button
              onClick={handleAddContact}
              className="px-6 py-2 bg-[#326EA6] text-white rounded hover:bg-[#255583]"
            >
              Ajouter
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
