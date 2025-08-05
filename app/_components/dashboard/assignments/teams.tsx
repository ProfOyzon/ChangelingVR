'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProfileMutation } from '@/hooks/use-profile';
import { processFormData, processZodError, zTeamsSchema } from '@/lib/auth/validator';
import type { PublicProfile } from '@/lib/db/schema';

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

export function TeamsSection({ profile }: { profile: PublicProfile }) {
  const [teams, setTeams] = useState<string[]>(profile.teams || []);
  const mutation = useProfileMutation();

  const handleTeamsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teams === profile.teams) return;

    // Pass the terms as a stringified array to the form data
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('teams', JSON.stringify(teams));

    // Validate the form data
    const result = zTeamsSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating teams...',
        success: 'Teams updated successfully',
        error: 'Failed to update teams',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleTeamsSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">Teams</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            This is your teams within Changeling VR.
          </CardDescription>
          <div className="flex flex-row flex-wrap gap-4">
            {TEAM_VALUES.map((team) => (
              <div key={team} className="flex flex-row items-center gap-1">
                <Checkbox
                  id={team}
                  value={team}
                  checked={teams.includes(team.toLowerCase())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTeams([...teams, team.toLowerCase()]);
                    } else {
                      setTeams(teams.filter((t) => t !== team.toLowerCase()));
                    }
                  }}
                />
                <Label htmlFor={team} className="text-sm">
                  {team}
                </Label>
              </div>
            ))}
          </div>
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please select at least one team.</p>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </form>
  );
}
