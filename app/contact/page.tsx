"use client";

import Header from "@/components/Header/Header";
import AddContactModal from "@/components/modals/AddContactModal";
import { Input } from "@/components/ui/input";
import { ChevronDown, LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";

const dummyPeople = [
  {
    id: 1,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 2,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 3,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 4,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 5,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 6,
    name: "Jojo Lipasa",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 7,
    name: "Lilly Mala",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 8,
    name: "Maggy Temo",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 9,
    name: "Jacques Marsse",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 10,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
];

import { ContactGridSkeleton } from "@/components/common/skeletons/contactGridSkeleton";
import { ContactListSkeleton } from "@/components/common/skeletons/ContactListSkeleton";
import { useContactActions } from "@/hooks/useContactActions";
import GridView from "./GridView";
import ListView from "./ListView";

const Contact = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openAddContact, setOpenAddContact] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);

  const { contacts, toggleMyContact, loading } = useContactActions({
    onlyMine,
  });

  // useEffect(() => {
  //   getContacts({ onlyMine }).then(setContacts);
  // }, [onlyMine]);

  return (
    <div>
      <Header />
      <div className="w-full px-40 py-8">
        {/* === TOP BAR === */}
        <div>
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-2 items-center">
              {/* Search */}
              <div className="flex items-center w-1/4 ">
                <Input
                  type="text"
                  placeholder="Chercher..."
                  className="w-full outline-none text-sm bg-card rounded-xs
                             dark:bg-[#071014] dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Middle actions */}
              <div className="flex items-center">
                {/* Filter */}
                <button className="flex items-center gap-2 bg-black dark:bg-[#63A053] text-white border rounded px-4 py-1.5 text-sm shadow-sm">
                  Afficher par
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Grid/List icons (toggle) */}
                <div className="flex items-center gap-3 rounded-md ml-3">
                  <button
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer duration-150 ${
                      view === "grid"
                        ? "bg-[#E9F6E8] dark:bg-[#113926] text-[#326A35]"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>

                  <button
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer duration-150 ${
                      view === "list"
                        ? "bg-[#E9F6E8] dark:bg-[#113926] text-[#326A35]"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    title="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Add contact */}
                <button
                  onClick={() => setOpenAddContact(true)}
                  className="flex items-center cursor-pointer gap-2 bg-black dark:bg-[#63A053] text-white rounded px-4 py-1.5 text-sm shadow ml-3"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un contact
                </button>
              </div>
            </div>

            <button
              className={`mes-contacts-css ${
                onlyMine ? "bg-[#63A053] text-white" : ""
              }`}
              onClick={() => setOnlyMine((prev) => !prev)}
            >
              {onlyMine ? "Tous les contacts" : "Mes contacts"}
            </button>
          </div>
        </div>

        {/* === CONTENT === */}
        {view === "grid" &&
          (loading.list ? (
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <ContactGridSkeleton key={i} />
              ))}
            </div>
          ) : !loading.list && contacts.length === 0 ? (
            <div className="flex justify-center items-center gap-4 mt-10 text-gray-500 dark:text-gray-400">
              <span>0 contact</span>
            </div>
          ) : (
            <GridView
              contacts={contacts}
              onToggleMyContact={toggleMyContact}
              isToggling={loading.toggle}
            />
          ))}

        {view === "list" &&
          (loading.list ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ContactListSkeleton key={i} />
              ))}
            </div>
          ) : !loading.list && contacts.length === 0 ? (
            <div className="flex justify-center items-center gap-4 mt-10 text-gray-500 dark:text-gray-400">
              <span>0 contact</span>
            </div>
          ) : (
            <ListView contacts={contacts} />
          ))}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10 text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95947 0L19.9188 17.25H0.000180244L9.95947 0Z"
              fill="#C7C7C7"
            />
          </svg>
          <span>1-20</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95947 17.25L19.9188 0L0.000180244 0L9.95947 17.25Z"
              fill="#C7C7C7"
            />
          </svg>
        </div>
      </div>
      <AddContactModal
        open={openAddContact}
        onClose={() => setOpenAddContact(false)}
      />
    </div>
  );
};

export default Contact;
