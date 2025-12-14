export const milestoneKeys = {
  all: ["milestones"] as const,
  project: (projectId: string) => [...milestoneKeys.all, projectId] as const,
};
