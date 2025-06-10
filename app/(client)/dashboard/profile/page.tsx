'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FormMessage } from '@/components/form-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useProfileMutation } from '../hooks/use-profile-mutation';
import { useProfileQuery } from '../hooks/use-profile-query';

const USERNAME_MAX = 15;
const DISPLAY_NAME_MAX = 50;
const BIO_MAX = 500;

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

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfileQuery();
  const mutation = useProfileMutation();
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [counts, setCounts] = useState({
    username: profile?.username?.length || 0,
    display_name: profile?.display_name?.length || 0,
    bio: profile?.bio?.length || 0,
  });

  const handleChange = useCallback(() => {
    if (!formRef.current) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to save after 500ms of no changes
    timeoutRef.current = setTimeout(() => {
      const formData = new FormData(formRef.current!);
      mutation.mutate(formData);
    }, 500);
  }, [mutation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCounts((prev) => ({ ...prev, [name]: value.length }));
    handleChange();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-4 h-32 w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500">Error loading profile</h1>
        <p className="text-gray-600">{error?.message || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onChange={handleChange} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="username">Username</Label>
          <span className="text-muted-foreground text-xs">
            {counts.username}/{USERNAME_MAX}
          </span>
        </div>
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">@</span>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username}
            className="pl-7"
            maxLength={USERNAME_MAX}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="display_name">Display Name</Label>
          <span className="text-muted-foreground text-xs">
            {counts.display_name}/{DISPLAY_NAME_MAX}
          </span>
        </div>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name || ''}
          className="w-full"
          maxLength={DISPLAY_NAME_MAX}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio">Bio</Label>
          <span className="text-muted-foreground text-xs">
            {counts.bio}/{BIO_MAX}
          </span>
        </div>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ''}
          className="w-full"
          rows={4}
          maxLength={BIO_MAX}
          onChange={handleInputChange}
        />
      </div>

      {/* Terms, Teams & Roles */}
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-2">
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
                        defaultChecked={profile.terms?.includes(year)}
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

        <div className="flex-1 space-y-2">
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
                      defaultChecked={profile.teams?.includes(team.toLowerCase())}
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

        <div className="flex-1 space-y-2">
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
                      defaultChecked={profile.roles?.includes(role.toLowerCase())}
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

      {mutation.error && <FormMessage type="error" message={mutation.error.message} />}
    </form>
  );
}
