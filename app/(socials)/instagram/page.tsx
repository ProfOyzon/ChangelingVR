import { redirect } from 'next/navigation';

export default async function InstagramPage() {
  'use cache';
  redirect('https://www.instagram.com/changelingvr');
}
