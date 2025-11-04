import { redirect } from 'next/navigation';

export default async function YoutubePage() {
  'use cache';
  redirect('https://www.youtube.com/@ChangelingVRStudio');
}
