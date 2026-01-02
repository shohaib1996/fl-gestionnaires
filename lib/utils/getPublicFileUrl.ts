const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getPublicFileUrl(filePath: string) {
  // If it's already a full URL, return it as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`;
}
