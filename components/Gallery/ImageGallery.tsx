"use client";
import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Image Section */}
      <section className="bg-white dark:bg-neutral-800 px-11 py-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
          Images
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative aspect-4/3 overflow-hidden rounded-md group cursor-pointer"
            >
              <Image
                src={url}
                alt={`Project image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <Button
                  onClick={() => setSelectedImage(url)}
                  className="p-3 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-gray-800" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Preview */}
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
