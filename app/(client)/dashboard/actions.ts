'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import { createClient } from '@/lib/db/supabase/server';
import { encodedRedirect } from '@/lib/redirect';
import { legacyUserSchema } from './schemas';

export async function updateProfileAction(formData: FormData) {
  // Get form data
  const data = {
    id: formData.get('id') as string,
    firstName: formData.get('first_name') as string,
    lastName: formData.get('last_name') as string,
    bio: formData.get('bio') as string,
    terms: formData.getAll('terms') as string[],
    roles: formData.getAll('roles') as string[],
    teams: formData.getAll('teams') as string[],
    link_email: formData.get('link_email') as string,
    link_website: formData.get('link_website') as string,
    link_github: formData.get('link_github') as string,
    link_linkedin: formData.get('link_linkedin') as string,
  };

  // Get the cookie store
  const cookieStore = await cookies();
  // Get the auth token from the cookie store
  const token = cookieStore.get('cvr_auth');

  // Ensure token is present
  if (!token) {
    return encodedRedirect('error', '/auth/login', 'Please log in to update your profile');
  }

  // Verify token
  let user;
  try {
    user = verify(token.value, process.env.JWT_ACCESS_SECRET!) as {
      id: number;
    };
  } catch {
    return encodedRedirect('error', '/auth/login', 'Invalid session. Please log in again');
  }

  // Ensure user is authorized
  if (!data.id || String(data.id) !== String(user.id)) {
    return encodedRedirect('error', '/auth/login', 'Mismatched session');
  }

  // Format data into a format that can be used by the database
  const updateData = {
    username: data.firstName.trim() + ' ' + data.lastName.trim(),
    bio: data.bio.trim(),
    terms: data.terms.join(',').trim(),
    roles: data.roles.join(',').trim(),
    teams: data.teams.join(',').trim(),
    link_email: data.link_email.trim(),
    link_website: data.link_website.trim(),
    link_github: data.link_github.trim(),
    link_linkedin: data.link_linkedin.trim(),
  };

  // Validate data
  const result = legacyUserSchema.safeParse(updateData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join(';');

    redirect(`/dashboard?uid=${data.id}&error=${encodeURIComponent(errorMessage)}`);
  }

  // Update the Profile
  const supabase = createClient();
  const { error: updateError } = await supabase
    .from('legacy_members')
    .update(updateData)
    .eq('id', data.id);

  if (updateError) {
    redirect(
      `/dashboard?uid=${data.id}&error=${encodeURIComponent(updateError.message || 'Failed to update profile')}`,
    );
  }

  // We use a success page to prevent repeat submissions
  redirect(`/dashboard/success?uid=${data.id}`);
}
