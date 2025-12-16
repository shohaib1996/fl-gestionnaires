export const milestoneKeys = {
  all: ["milestones"] as const,
  project: (projectId: string) => [...milestoneKeys.all, projectId] as const,
};

export const assignedProjectKeys = {
  details: (projectId: string) =>
    ["assigned-project-details", projectId] as const,
};
