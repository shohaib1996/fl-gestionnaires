import { MilestoneTabs } from "@/app/dashboard/[id]/project/[projectId]/MilestoneTabas";

export default function MilestoneSection({
  project,
  activeMilestoneId,
  onMilestoneChange,
}: any) {
  return (
    <>
      {" "}
      {/* Phases */}
      <div className="flex flex-wrap gap-2 mb-4 px-3">
        <MilestoneTabs
          activeMilestoneId={activeMilestoneId}
          milestones={project.milestones}
          onChange={(milestoneId) => {
            router.push(
              `/dashboard/${projectId}/project/${projectId}?milestone=${milestoneId}`
            );
          }}
        />
        <button
          onClick={() => setJalonModalOpen(true)}
          className="ml-auto bg-[#63A053] text-white px-3 py-1 text-sm font-medium rounded-xs cursor-pointer"
        >
          + Jalon
        </button>
      </div>
      {/* Goal + Lead */}
      <div className="flex justify-between items-start mb-6 px-6">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <strong>Goal:</strong> {project.goal}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/images/profile.jpeg"
            alt={project.manager.name || "Project Lead"}
            width={40}
            height={40}
            className="rounded-full object-cover h-10"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {project.manager.name || "Project Lead"}
            </p>
            <p className="text-xs text-gray-500">{project.manager.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
