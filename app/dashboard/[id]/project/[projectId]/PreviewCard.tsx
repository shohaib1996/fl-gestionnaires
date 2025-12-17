import { getPublicFileUrl } from "@/lib/utils/getPublicFileUrl";
import { Download, FileText, Fullscreen, Printer } from "lucide-react";
import Image from "next/image";

interface Props {
  previewURL: string | null;
  handleDownload: (url: string, filename?: string) => void;
  handlePrint: (url: string, type: string) => void;
  setFullscreenOpen: (open: boolean) => void;
}

function getPreviewKind(url: string) {
  const ext = url.split(".").pop()?.toLowerCase();

  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
  if (["mp4", "webm"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["mp3", "wav"].includes(ext)) return "audio";

  return "other";
}

function SimplePreview({ url }: { url: string }) {
  const type = getPreviewKind(url);

  if (type === "image") {
    return (
      <Image
        src={url}
        alt="Preview"
        width={400}
        height={400}
        className="object-contain max-h-[44vh]"
      />
    );
  }

  if (type === "video") {
    return <video src={url} controls className="w-full max-h-[44vh] rounded" />;
  }

  if (type === "pdf") {
    return <iframe src={url} className="w-full h-[44vh] rounded border" />;
  }

  if (type === "audio") {
    return <audio src={url} controls className="w-full" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[44vh] text-gray-500">
      <FileText className="w-10 h-10 mb-2" />
      <p>No preview available</p>
      <a href={url} download className="text-blue-600 underline">
        Download file
      </a>
    </div>
  );
}

export default function PreviewCard({
  previewURL,
  handleDownload,
  handlePrint,
  setFullscreenOpen,
}: Props) {
  return (
    <div className="border border-gray-200 dark:border-neutral-700 rounded-md p-3 flex flex-col items-center">
      {previewURL ? (
        <>
          <SimplePreview url={getPublicFileUrl(previewURL) || ""} />
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={() =>
                handleDownload(previewURL || "", "preview-download")
              }
              className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() => handlePrint(previewURL || "", "image")}
              className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>

            {/* FULLSCREEN CLICK */}
            <button
              onClick={() => setFullscreenOpen(true)}
              className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            >
              <Fullscreen className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="p-6 text-gray-500">No preview available.</p>
        </div>
      )}
    </div>
  );
}
