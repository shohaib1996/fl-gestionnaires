export function usePreviewActions() {
  const download = async (url: string, filename = "file") => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const print = (url: string, type: "image" | "pdf" | "web") => {
    const win = window.open(url, "_blank");
    if (!win) return;
    win.onload = () => win.print();
  };

  return { download, print };
}
