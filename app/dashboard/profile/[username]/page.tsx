import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/server';
import { verify } from 'jsonwebtoken';
import { updateProfileAction } from '../../actions';

const TEAM_VALUES = [
  'Development',
  'Art',
  'Tech Art',
  'Audio',
  'Web',
  'Narrative',
  'Voice',
  'Production',
] as const;

const ROLE_VALUES = [
  'Programmer',
  'Level Designer',
  'UI/UX Designer',
  'Writer',
  'Voice Actor',
  '2D Artist',
  '3D Modeler',
  'Tech Artist',
  'Concept Artist',
  'Sound Designer',
  'Composer',
  'Producer',
  'Lead',
] as const;

type JwtUserPayload = {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
};

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { username } = await params;
  const { error } = await searchParams;

  // Get the auth token and verify it
  const cookieStore = await cookies();
  const token = cookieStore.get('cvr_auth')!;
  const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtUserPayload;

  // Username mismatch, redirect to login
  if (decoded.username !== username) {
    redirect('/auth/login');
  }

  // Get the user data from the database
  const supabase = createClient();
  const { data: userData } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, bio, terms, teams, roles, links')
    .eq('username', username)
    .single();

  // If the user data is not found, show a 404 page
  if (!userData) notFound();

  return (
    <CardContent>
      <form action={updateProfileAction} className="space-y-6">
        <input type="hidden" name="id" value={userData.username} />

        {/* Profile Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={userData.display_name}
              maxLength={50}
              placeholder="Your display name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={userData.bio}
              maxLength={500}
              placeholder="Tell us about yourself... (500 characters max)"
              className="h-20 resize-none"
            />
          </div>
        </div>

        {/* Terms, Teams & Roles */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 space-y-1">
            <Label>Terms</Label>
            <ScrollArea className="h-[100px] rounded-md border p-2 md:h-[250px]">
              <div className="grid grid-cols-1 gap-1">
                {Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i).map(
                  (year) => {
                    return (
                      <div key={year} className="flex items-center space-x-2">
                        <Checkbox
                          id={`term-${year}`}
                          name="terms"
                          value={year.toString()}
                          defaultChecked={userData.terms.includes(year)}
                        />
                        <Label htmlFor={`term-${year}`} className="text-sm font-normal">
                          {year}
                        </Label>
                      </div>
                    );
                  },
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 space-y-1">
            <Label>Teams</Label>
            <ScrollArea className="h-[100px] rounded-md border p-2 md:h-[250px]">
              <div className="grid grid-cols-1 gap-1">
                {TEAM_VALUES.map((team) => {
                  return (
                    <div key={team} className="flex items-center space-x-2">
                      <Checkbox
                        id={`team-${team}`}
                        name="teams"
                        value={team}
                        defaultChecked={userData.teams?.includes(team.toLowerCase())}
                      />
                      <Label htmlFor={`team-${team}`} className="text-sm font-normal capitalize">
                        {team}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 space-y-1">
            <Label>Roles</Label>
            <ScrollArea className="h-[100px] rounded-md border p-2 md:h-[250px]">
              <div className="grid grid-cols-1 gap-1">
                {ROLE_VALUES.map((role) => {
                  return (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        name="roles"
                        value={role}
                        defaultChecked={userData.roles?.includes(role.toLowerCase())}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm font-normal capitalize">
                        {role}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="link_email">Email Link</Label>
              <Input
                id="link_email"
                name="link_email"
                type="email"
                defaultValue={userData.links.email}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="link_website">Website</Label>
              <Input
                id="link_website"
                name="link_website"
                type="url"
                defaultValue={userData.links.website}
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="link_github">GitHub</Label>
              <Input
                id="link_github"
                name="link_github"
                type="url"
                defaultValue={userData.links.github}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="link_linkedin">LinkedIn</Label>
              <Input
                id="link_linkedin"
                name="link_linkedin"
                type="url"
                defaultValue={userData.links.linkedin}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        {error && <FormMessage type="error" message={error} />}

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </CardContent>
  );
}
