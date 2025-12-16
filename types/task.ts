export interface AddDocumentPayload {
  milestoneId: string;
  name: string;
  category: string | null;
  description: string;
  file_format: string;
}
