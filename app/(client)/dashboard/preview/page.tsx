import { getUserProfile } from "@/lib/db/queries";
import type { Profile } from "@/lib/db/schema";

export default async function PreviewPage() {
  const user = (await getUserProfile()) as Profile;

  if (!user) {
    return <div>Previews not available yet</div>;
  }

  console.log(user);

  return <div>Previews not available yet</div>;
}
