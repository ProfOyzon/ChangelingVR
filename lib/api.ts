/**
 * Fetch an image from a public Supabase storage.
 * @param {Object} props
 * @param {string} props.container - The name of the Supabase storage container.
 * @param {string} props.path - The path to the image in the container.
 * @returns {string} The URL to the image in Supabase storage.
 */
export const fetchSupabaseImage = ({
  container,
  path,
}: {
  container: string;
  path: string;
}): string => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${container}/${path}`;
};

export const fetchBlob = async ({ container, path }: { container: string; path: string }) => {
  const url = fetchSupabaseImage({ container, path });
  const res = await fetch(url);
  return res.blob();
};
