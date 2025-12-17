import Image from "next/image";
import AddDocumentModal from "../modals/AddDocumentModal";
import CreateJalonModal from "../modals/CreateJalonModal";
import EditDocumentModal from "../modals/EditDocumentModal";
import JalonDetailsModal from "../modals/JalonDetailsModal";

export default function ProjectModals({
  fullscreenOpen,
  setFullscreenOpen,
  project,
  jalonModalOpen,
  setJalonModalOpen,
  jalonDetailsModalOpen,
  setJalonDetailsModalOpen,
  selectedPhase,
  openAddDoc,
  setOpenAddDoc,
  openEditDoc,
  setOpenEditDoc,
  handleTaskAdd,
  handleTaskEdit,
}: any) {
  return (
    <>
      {fullscreenOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999  p-4"
          onClick={() => setFullscreenOpen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Viewer (supports future types) */}

            <Image
              src={project.preview.image}
              alt="Fullscreen preview"
              width={1400}
              height={1400}
              className="rounded-md object-contain max-h-[90vh]"
            />
            {/* Close button */}
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute top-3 right-3 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <CreateJalonModal
        open={jalonModalOpen}
        onClose={() => setJalonModalOpen(false)}
        projectId={project.id}
        manager={project.manager}
      />
      {selectedPhase && (
        <JalonDetailsModal
          open={jalonDetailsModalOpen}
          onClose={() => setJalonDetailsModalOpen(false)}
          phase={selectedPhase}
        />
      )}
      <AddDocumentModal
        open={openAddDoc}
        onClose={() => setOpenAddDoc(false)}
        onSubmit={handleTaskAdd}
      />
      <EditDocumentModal
        open={openEditDoc}
        onClose={() => setOpenEditDoc(false)}
        doc={selectedTask}
      />
    </>
  );
}
