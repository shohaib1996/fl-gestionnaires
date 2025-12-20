"use client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  request: any;
}

export default function ShowDocuments({ request }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <>
      {request.id_front_image && (
        <div className="relative aspect-4/3 overflow-hidden rounded-md group cursor-pointer">
          <Image
            src={request.id_front_image}
            alt={`Project image ${request.id_front_image}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <Button
              onClick={() => setSelectedImage(request.id_front_image)}
              className="p-3 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 cursor-pointer"
            >
              <Eye className="w-5 h-5 text-gray-800" />
            </Button>
          </div>
        </div>
      )}
      {request.id_back_image && (
        <div className="relative aspect-4/3 overflow-hidden rounded-md group cursor-pointer">
          <Image
            src={request.id_back_image}
            alt={`Project image ${request.id_back_image}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <Button
              onClick={() => setSelectedImage(request.id_back_image)}
              className="p-3 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 cursor-pointer"
            >
              <Eye className="w-5 h-5 text-gray-800" />
            </Button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90%] max-w-4xl">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1000}
              height={800}
              className="rounded-md object-contain max-h-[90vh] mx-auto"
            />
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 cursor-pointer -right-4 bg-red-500 text-white rounded-full p-3 shadow-md hover:bg-red-700 transition"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
