'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomBytes, randomUUID } from 'node:crypto';
import { PasswordResetEmail, WelcomeEmail } from '@/components/email';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from '@/lib/auth/validator';
import { createClient } from '@/lib/db/supabase/server';
import { sendMail } from '@/lib/nodemailer';
import { encodedRedirect } from '@/lib/redirect';
import { comparePassword, generateToken, hashPassword, hashToken, processError } from './utils';

export async function registerAction(formData: FormData) {
  // Parse the form data
  const result = registerSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    accessCode: formData.get('access-code') as string,
  });

  // If the form data is invalid, return an error
  if (!result.success) {
    return encodedRedirect('error', '/auth/register', processError(result.error));
  }

  // Passed validation
  const { email, password } = result.data;
  const supabase = createClient();

  // Check if the email is already in use
  const { data: existingUser } = await supabase
    .from('members')
    .select('uuid')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    return encodedRedirect('error', '/auth/register', 'Email already in use');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create a new member and get the uuid
  const { data: newMember, error: newMemberError } = await supabase
    .from('members')
    .insert({ email, password: hashedPassword })
    .select('uuid')
    .single();

  if (newMemberError) {
    return encodedRedirect('error', '/auth/register', 'Failed to create member');
  }

  // Create a new profile
  const username = email.split('@')[0].toLowerCase() + '-' + randomBytes(4).toString('hex');
  const { error: newProfileError } = await supabase.from('profiles').insert({
    uuid: newMember.uuid,
    username,
    terms: [new Date().getFullYear()],
  });

  if (newProfileError) {
    return encodedRedirect('error', '/auth/register', 'Failed to create profile');
  }

  // Send welcome email
  await sendMail({
    reciever: email,
    subject: 'Welcome to Changeling VR',
    plainText: "Welcome to Changeling VR! We're excited to have you on board.",
    email: WelcomeEmail({ name: username }),
  });

  return encodedRedirect('success', '/auth/login', 'Registration successful, login to continue');
}

export async function forgotPasswordAction(formData: FormData) {
  // Parse the form data
  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email') as string,
  });

  // If the form data is invalid, return an error
  if (!result.success) {
    return encodedRedirect('error', '/auth/forgot-password', processError(result.error));
  }

  // Passed validation, get email and create supabase client
  const { email } = result.data;
  const supabase = createClient();

  // Get uuid and email from members table with the given email
  const { data, error } = await supabase
    .from('members')
    .select('uuid, email')
    .eq('email', email)
    .single();

  if (error || !data) {
    // Show success page, avoids user enumeration
    redirect(`/auth/forgot-password?success=true`);
  }

  // Get the display name from the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('uuid', data.uuid)
    .single();

  if (profileError || !profileData) {
    // Show success page, avoids user enumeration
    redirect(`/auth/forgot-password?success=true`);
  }

  // Generate a random token
  const token = randomUUID();
  const hashedToken = hashToken(token);

  // Add the token to the legacy_members table
  const { error: tokenError } = await supabase.from('reset_tokens').upsert(
    {
      uuid: data.uuid,
      token: hashedToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
    },
    { onConflict: 'uuid' },
  );

  if (tokenError) {
    // Token addition failed
    return encodedRedirect('error', '/auth/forgot-password', tokenError.message);
  }

  // Create the reset password link and send email
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password?token=${encodeURIComponent(token)}`;
  const { success } = await sendMail({
    reciever: data.email,
    subject: 'Changeling VR Password Reset',
    plainText: `Click the link to reset your password: ${url}`,
    email: PasswordResetEmail({ username: profileData.display_name, url }),
  });

  // Email failed to send
  if (!success) {
    return encodedRedirect('error', '/auth/forgot-password', 'Failed to send email');
  }

  // Redirect to same page with success message
  redirect(`/auth/forgot-password?success=true`);
}

export async function loginAction(formData: FormData) {
  // Parse the form data
  const result = loginSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  // If the form data is invalid, return an error
  if (!result.success) {
    return encodedRedirect('error', '/auth/login', processError(result.error));
  }

  // Passed validation
  // Get email and password, get cookies, and create supabase client
  const { email, password } = result.data;
  const cookieStore = await cookies();
  const supabase = createClient();

  // Get id, email, username, and password
  const { data, error } = await supabase.from('members').select('*').eq('email', email).single();

  // Check if the user exists
  if (error || !data || !(await comparePassword(password, data.password))) {
    return encodedRedirect('error', '/auth/login', 'Email or password is incorrect');
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('uuid', data.uuid)
    .single();

  if (profileError || !profileData) {
    return encodedRedirect('error', '/auth/login', 'Profile not found');
  }

  const { username } = profileData;

  // Generate a JWT token
  const token = generateToken({ uuid: data.uuid, email: data.email, username: username });

  // Set the token in a cookie
  cookieStore.set('cvr_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'lax',
  });

  // Redirect to the profile page
  redirect(`/dashboard/profile/${username}`);
}

export async function logoutAction() {
  // Get the cookie store
  const cookieStore = await cookies();
  // Get the auth token from the cookie store
  const token = cookieStore.get('cvr_auth');

  // If the token exists, set it to an empty string and expire it immediately
  if (token) {
    cookieStore.set('cvr_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0, // expire immediately
      sameSite: 'lax',
    });
  }

  // Redirect to the login page
  redirect('/auth/login');
}

export async function updatePasswordAction(formData: FormData) {
  // Parse the form data
  const result = updatePasswordSchema.safeParse({
    token: formData.get('token') as string,
    password: formData.get('password') as string,
  });

  // If the form data is invalid, return an error
  if (!result.success) {
    return encodedRedirect('error', '/auth/update-password', processError(result.error));
  }

  // Passed validation
  // Get email, token, and password and create supabase client
  const { token, password } = result.data;
  const hashedToken = hashToken(token);

  // Get the reset token from the reset_tokens table
  const supabase = createClient();
  const { data: tokenData, error: tokenError } = await supabase
    .from('reset_tokens')
    .select('*')
    .eq('token', hashedToken)
    .single();

  // If the token is invalid, return an error
  if (tokenError || !tokenData) {
    return encodedRedirect('error', '/auth/update-password', 'Invalid token');
  }

  // If the token has expired, return an error
  if (tokenData.expires_at < new Date()) {
    return encodedRedirect('error', '/auth/update-password', 'Token expired');
  }

  // Hash the password and update the user's password
  const hashedPassword = await hashPassword(password);
  const { error } = await supabase
    .from('members')
    .update({ password: hashedPassword })
    .eq('uuid', tokenData.uuid);

  // If there is an error, return back to the update password page with an error message
  if (error) {
    return encodedRedirect('error', '/auth/update-password', error.message);
  }

  // Delete the token from the reset_tokens table
  await supabase.from('reset_tokens').delete().eq('uuid', tokenData.uuid);

  // Redirect to login page with success message
  redirect('/auth/login?success=Password updated');
}
