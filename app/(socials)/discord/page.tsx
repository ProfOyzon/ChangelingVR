import { redirect } from 'next/navigation';

export default async function DiscordPage() {
  'use cache';
  redirect('https://discord.gg/btEUjqazvP');
}
