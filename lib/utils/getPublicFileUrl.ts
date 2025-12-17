const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getPublicFileUrl(filePath: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`;
}
