export interface AddDocumentPayload {
  milestoneId: string;
  name: string;
  category: string | null;
  description: string | null;
  file_format: string;
}

export interface EditTaskInput {
  taskId: string;
  title?: string;
  description?: string | null;
  category?: string | null;
  file_format?: string;
}
