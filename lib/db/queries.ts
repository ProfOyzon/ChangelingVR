'use server';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

export async function getUserMember() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('members')
    .select('*')
    .eq('uuid', sessionData.user.id)
    .single();

  if (!user || error) {
    return null;
  }

  return user;
}

export async function getUserProfile() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('uuid', sessionData.user.id)
    .single();

  if (!user || error) {
    return null;
  }

  return user;
}

export async function getActivityLogs() {
  const user = await getUserProfile();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const supabase = createClient();
  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('uuid', user.uuid)
    .order('timestamp', { ascending: false })
    .limit(10);

  return data;
}
