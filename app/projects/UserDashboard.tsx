"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/providers/UserProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserProject = {
  id: string;
  name: string;
};

const supabase = createClient();

export default function UserDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      if (!user?.email) {
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("id, title")
        .eq("email", user.email);

      if (error) {
        toast.error("Impossible de charger les projets");
        setLoading(false);
        return;
      }

      const mapped =
        data?.map((row) => ({
          id: row.id, // ✅ direct field
          name: row.title, // ✅ direct field
        })) ?? [];

      setProjects(mapped);
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="bg-[#e8e8e8] min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-center bg-white shadow-sm px-6">
        <Link href="/projects">
          <h1 className="font-bold text-[#63a053] text-2xl tracking-wide">
            FOND LOCAL
          </h1>
        </Link>
      </div>

      <div className="py-8 text-center">
        <h2 className="text-xl font-medium">Vos projets</h2>
      </div>

      <div className="flex flex-col gap-6 px-6 pb-10">
        {loading && <p className="text-center">Chargement...</p>}

        {!loading && projects.length === 0 && (
          <p className="text-center text-gray-500">Aucun projet trouvé</p>
        )}

        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="bg-[#63a053] rounded-lg px-6 py-8 shadow-sm cursor-pointer active:scale-[0.98]"
          >
            <p className="text-white/70 text-sm mb-1">Projet</p>
            <h3 className="text-white text-xl font-semibold">{project.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
