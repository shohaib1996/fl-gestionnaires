import { getPublicFileUrl } from "@/lib/utils/getPublicFileUrl";
import { Download, Fullscreen, Printer } from "lucide-react";
import PreviewRenderer, { getPreviewKind } from "./PreviewRenderer";

interface Props {
  previewURL: string | null;
  handleDownload: (url: string, filename?: string) => void;
  handlePrint: (url: string, type: string) => void;
  setFullscreenOpen: (open: boolean) => void;
}

export default function PreviewCard({
  previewURL,
  handleDownload,
  handlePrint,
  setFullscreenOpen,
}: Props) {
  return (
    <div className="border border-gray-200 dark:border-neutral-700 rounded-md p-3 flex flex-col items-center h-full">
      {previewURL ? (
        <>
          <PreviewRenderer
            url={getPublicFileUrl(previewURL) || ""}
            variant="inline"
          />
          <div className="flex justify-center gap-3 mt-5">
            <button
              onClick={() =>
                handleDownload(
                  getPublicFileUrl(previewURL) || "",
                  "preview-download"
                )
              }
              className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                handlePrint(
                  getPublicFileUrl(previewURL) || "",
                  getPreviewKind(previewURL)
                )
              }
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
