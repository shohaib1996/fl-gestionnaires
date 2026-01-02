import { getPublicFileUrl } from "@/lib/utils/getPublicFileUrl";
import { FileText, Globe } from "lucide-react";
import Image from "next/image";

type PreviewVariant = "inline" | "fullscreen";

interface PreviewRendererProps {
  url: string;
  variant?: PreviewVariant;
}

export function isValidUrl(value: string) {
  try {
    // auto-fix missing protocol
    new URL(value.startsWith("http") ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

export function getPreviewKind(url: string) {
  const clean = url.trim().toLowerCase();

  const ext = clean.split(".").pop();

  // 1️⃣ File previews first (strong signal)
  if (ext) {
    if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
    if (["mp4", "webm"].includes(ext)) return "video";
    if (ext === "pdf") return "pdf";
    if (["mp3", "wav"].includes(ext)) return "audio";
  }

  // 2️⃣ URL or external reference
  if (isValidUrl(clean)) {
    return "link";
  }

  // 3️⃣ Fallback
  return "other";
}

export default function PreviewRenderer({
  url,
  variant = "inline",
}: PreviewRendererProps) {
  const type = getPreviewKind(url);
  const height = variant === "fullscreen" ? "h-full" : "h-full";
  const previewURL = getPublicFileUrl(url);

  switch (type) {
    case "image":
      if (variant === "fullscreen") {
        return (
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={previewURL}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        );
      }

      return (
        <div
          className={`relative w-full ${height} overflow-hidden flex items-center justify-center`}
        >
          <Image
            src={previewURL}
            alt="Preview"
            width={400}
            height={400}
            className="object-contain max-w-full max-h-full"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      );

    case "video":
      return (
        <video
          src={previewURL}
          controls
          className={`w-full ${height} rounded grow`}
        />
      );

    case "pdf":
      return (
        <div
          className={`w-full ${height} overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded`}
        >
          <iframe
            src={`${previewURL}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-0"
          />
        </div>
      );

    case "audio":
      return <audio src={previewURL} controls className="w-full" />;

    case "link":
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Globe className="w-10 h-10 mb-3 text-[#326EA6]" />

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Lien externe
          </p>

          <a
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline break-all"
          >
            {url}
          </a>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 h-full">
          <FileText className="w-10 h-10 mb-2" />
          <p>No preview available</p>
          <a href={url} download className="text-blue-600 underline">
            Download file
          </a>
        </div>
      );
  }
}
