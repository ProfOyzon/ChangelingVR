type Filters = {
  dev: string;
  roles: string[];
  years: string[];
};

type Dev = {
  username: string;
  roles: string;
  terms: string;
  id: string;
  avatar: string;
};

export const fetchDevs = async (filters: Filters) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/devs`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error('Failed to fetch devs');
  const devs = (await res.json()) as Dev[];

  if (
    !filters.dev &&
    (!filters.roles?.length || filters.roles.includes('All')) &&
    (!filters.years?.length || filters.years.includes('All'))
  ) {
    return devs;
  }

  return devs.filter((dev: Dev) => {
    // Filter by username
    const matchesUsername: boolean = dev.username
      .toLowerCase()
      .includes(filters.dev?.toLowerCase());

    // Filter by roles
    const devRoles: string[] = dev.roles.split(',').map((r) => r.trim().toLowerCase());
    const filterRoles: string[] = (filters.roles ?? []).map((r) => r.toLowerCase());
    const matchesRoles: boolean =
      !filterRoles.length ||
      filterRoles.includes('all') ||
      filterRoles.some((role) => devRoles.includes(role));

    // Filter by years
    const devYears: string[] = dev.terms.match(/\d{4}/g) ?? [];
    const filterYears: string[] = filters.years ?? [];
    const matchesYears: boolean =
      !filterYears.length ||
      filterYears.includes('All') ||
      filterYears.some((year) => devYears.includes(year));

    return matchesUsername && matchesRoles && matchesYears;
  });
};

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
