import { Download, Fullscreen, Printer } from "lucide-react";
import Image from "next/image";

export default function PreviewSection({
  project,

  setFullscreenOpen,
}: any) {
  const handleDownload = async (url: string, filename = "file") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Unable to download file.");
    }
  };
  const handlePrint = async (url: string, type: string) => {
    try {
      if (type === "image") {
        // Create a hidden window for printing
        const printWindow = window.open("", "_blank", "width=900,height=700");

        if (!printWindow) return alert("Popup blocked. Allow popups to print.");

        printWindow.document.write(`
        <html>
          <head>
            <title>Print Image</title>
            <style>
              body { margin: 0; padding: 0; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${url}" />
            <script>
              window.onload = () => {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
        printWindow.document.close();
      } else if (type === "pdf") {
        // PDF can be printed directly
        const printWindow = window.open(url, "_blank");
        if (!printWindow) return alert("Popup blocked. Allow popups to print.");

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else if (type === "web") {
        const printWindow = window.open(url, "_blank");
        if (!printWindow) return alert("Popup blocked.");

        printWindow.onload = () => {
          printWindow.print();
        };
      } else if (type === "video") {
        alert("Printing videos is not supported. Try downloading instead.");
      }
    } catch (err) {
      console.error("Print failed:", err);
      alert("Unable to print file.");
    }
  };
  return (
    <div className="border border-gray-200 dark:border-neutral-700 rounded-md p-3 flex flex-col items-center">
      {project?.preview ? (
        <>
          <Image
            src={project.preview?.image || ""}
            alt="Preview"
            width={400}
            height={500}
            className="rounded-md object-contain max-h-[44vh] min-w-[35vw]"
          />
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={() =>
                handleDownload(project.preview.image, "preview-download")
              }
              className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() => handlePrint(project.preview.image, "image")}
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
