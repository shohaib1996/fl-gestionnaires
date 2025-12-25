"use client";

import Header from "@/components/Header/Header";
import AddContactModal from "@/components/modals/AddContactModal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutGrid, List, Plus, Send } from "lucide-react";
import { useState } from "react";

import { ContactGridSkeleton } from "@/components/common/skeletons/contactGridSkeleton";
import { ContactListSkeleton } from "@/components/common/skeletons/ContactListSkeleton";
import { useContactActions } from "@/hooks/useContactActions";
import GridView from "./GridView";
import ListView from "./ListView";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const TITLE_OPTIONS = ["Developer", "Lawyer", "Investor", "Teacher"];

const Contact = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openAddContact, setOpenAddContact] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const [search, setSearch] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherTitle, setOtherTitle] = useState("");

  const [page, setPage] = useState(1);

  const { contacts, total, toggleMyContact, loading } = useContactActions({
    onlyMine,
    page,
    pageSize: PAGE_SIZE,
    search,
    titleFilter,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleTitleFilterChange = (value: string) => {
    if (value === "other") {
      setShowOtherInput(true);
      setTitleFilter("");
    } else {
      setShowOtherInput(false);
      setTitleFilter(value);
      setPage(1);
    }
  };

  const handleOtherTitleSubmit = () => {
    if (!otherTitle.trim()) {
      toast.error("Veuillez entrer un titre");
      return;
    }
    // Apply the custom title as filter
    setTitleFilter(otherTitle);
    setPage(1);
    // Send request to backend to add this new title
    toast.success(`Filtre appliqué: ${otherTitle}`);
    setOtherTitle("");
    setShowOtherInput(false);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

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
                  placeholder="Chercher par nom ou email..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full outline-none text-sm bg-card rounded-xs
                             dark:bg-[#071014] dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Middle actions */}
              <div className="flex items-center">
                {/* Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-black dark:bg-[#63A053] text-white border rounded px-4 py-1.5 text-sm shadow-sm">
                      {titleFilter || "Afficher par"}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {!showOtherInput ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setTitleFilter("");
                            setShowOtherInput(false);
                            setPage(1);
                          }}
                        >
                          Tous
                        </DropdownMenuItem>
                        {TITLE_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option}
                            onClick={() => handleTitleFilterChange(option)}
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            setShowOtherInput(true);
                            setTitleFilter("");
                          }}
                        >
                          Autre...
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <div className="p-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <p className="text-sm font-medium px-2">
                          Entrez un nouveau titre:
                        </p>
                        <Input
                          type="text"
                          placeholder="Ex: Designer, Architecte..."
                          value={otherTitle}
                          onChange={(e) => setOtherTitle(e.target.value)}
                          className="text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleOtherTitleSubmit();
                            }
                            if (e.key === "Escape") {
                              setShowOtherInput(false);
                              setOtherTitle("");
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleOtherTitleSubmit}
                            className="flex-1 px-3 py-1.5 bg-[#63A053] text-white rounded-xs text-sm flex items-center justify-center gap-1 hover:bg-[#4e8742] transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Envoyer
                          </button>
                          <button
                            onClick={() => {
                              setShowOtherInput(false);
                              setOtherTitle("");
                            }}
                            className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-xs text-sm hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border disabled:opacity-50"
            >
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
            </button>

            <span className="px-3 py-1">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border disabled:opacity-50"
            >
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
            </button>
          </div>
        )}
      </div>
      <AddContactModal
        open={openAddContact}
        onClose={() => setOpenAddContact(false)}
        onSuccess={() => setPage(1)}
      />
    </div>
  );
};

export default Contact;
