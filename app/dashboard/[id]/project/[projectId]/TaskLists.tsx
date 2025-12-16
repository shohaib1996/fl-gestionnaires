import { TasksByMilestone } from "@/app/actions/projects/milestones/tasks/getTasksByMilestone";
import { iconMap } from "@/components/common/FileIconMap";

export default function TaskLists({ tasks }: { tasks: TasksByMilestone[] }) {
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

  if (tasks.length < 0) return <div></div>;

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 sticky top-0">
        <tr>
          <th className="text-left px-4 py-2">Date</th>
          <th className="text-left px-4 py-2"></th>
          <th className="text-left px-4 py-2">Description</th>
          <th className="text-left px-4 py-2">Catégorie</th>
          <th className="text-left px-4 py-2">Progression</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task, i) => {
          const Icon = iconMap[task.file_format];
          return (
            <tr
              key={i}
              className={`border-t dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-neutral-700/50 transition ${
                i === 1 ? "bg-blue-50 dark:bg-neutral-700/50" : ""
              } h-[7vh]`}
            >
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {new Date(task.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </td>

              <td className="px-4 py-2 gap-2 text-gray-700 dark:text-gray-200">
                <Icon className="w-6 h-6 text-[#326EA6] cursor-pointer" />
              </td>
              <td className="px-4 py-2 gap-2 text-gray-700 dark:text-gray-200">
                {task.description}
              </td>

              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {task.category}
              </td>

              <td className="px-4 py-2 text-gray-700 dark:text-gray-100 capitalize">
                {task.status}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
