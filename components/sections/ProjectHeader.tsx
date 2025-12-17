import { ArrowLeft } from "lucide-react";

export default function ProjectHeader() {
  return (
    <div className="flex items-center gap-1 py-6">
      <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-3 py-1 rounded-none flex items-center gap-1 text-sm font-medium transition">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-4 py-1 text-sm">
        Partager
      </button>
      <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
        Reçus
      </button>
      <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
        Retenus
      </button>
      <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
        En cours
      </button>
    </div>
  );
}
