export default async function SettingsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  console.log(username);

  return <div>Settings Page</div>;
}
