'use client';

import { useActionState } from 'react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { updateProfile } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';
import type { Profile } from '@/lib/db/schema';

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

export function ProfileClientPage({ user }: { user: Profile }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateProfile, {
    error: '',
  });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="username" value={user.username} />

      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={user.display_name || ''}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={user.bio || ''} className="w-full" rows={4} />
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
                        value={year}
                        defaultChecked={user.terms?.includes(year)}
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
                      value={team.toLowerCase()}
                      defaultChecked={user.teams?.includes(team.toLowerCase())}
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
                      value={role.toLowerCase()}
                      defaultChecked={user.roles?.includes(role.toLowerCase())}
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

      {/* <div className="flex flex-col gap-4 md:flex-row">
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
          </div> */}

      {state?.error && <FormMessage type="error" message={state.error} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
