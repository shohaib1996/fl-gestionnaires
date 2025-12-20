import { FileText } from "lucide-react";
import Image from "next/image";

type PreviewVariant = "inline" | "fullscreen";

interface PreviewRendererProps {
  url: string;
  variant?: PreviewVariant;
}

export function getPreviewKind(url: string) {
  const ext = url.split(".").pop()?.toLowerCase();

  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
  if (["mp4", "webm"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["mp3", "wav"].includes(ext)) return "audio";

  return "other";
}

export default function PreviewRenderer({
  url,
  variant = "inline",
}: PreviewRendererProps) {
  const type = getPreviewKind(url);
  const height = variant === "fullscreen" ? "h-full" : "h-[44vh]";

  switch (type) {
    case "image":
      return (
        <Image
          src={url}
          alt="Preview"
          fill={variant === "fullscreen"}
          width={variant === "inline" ? 400 : undefined}
          height={variant === "inline" ? 1000 : undefined}
          className="object-contain grow"
        />
      );

    case "video":
      return (
        <video src={url} controls className={`w-full ${height} rounded grow`} />
      );

    case "pdf":
      return (
        <div className={`w-full ${height} overflow-hidden`}>
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-[120%] scale-[0.9] origin-top border rounded"
          />
        </div>
      );

    case "audio":
      return <audio src={url} controls className="w-full" />;

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
