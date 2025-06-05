import { redirect } from 'next/navigation';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/types';
import { updateProfileAction } from '../actions';

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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // If the user data is not found, show a 404 page
  const userData = (await getUserProfile()) as Profile;
  if (!userData) redirect('/auth/login');

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
                          defaultChecked={userData.terms?.includes(year)}
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
