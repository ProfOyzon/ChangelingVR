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
import { processFormData, processZodError, zRolesSchema } from '@/lib/auth/validator';
import type { PublicProfile } from '@/lib/db/schema';

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
];

export function RolesSection({ profile }: { profile: PublicProfile }) {
  const [roles, setRoles] = useState<string[]>(profile.roles || []);
  const mutation = useProfileMutation();

  const handleTermsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roles === profile.roles) return;

    // Pass the terms as a stringified array to the form data
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('roles', JSON.stringify(roles));

    // Validate the form data
    const result = zRolesSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating roles...',
        success: 'Roles updated successfully',
        error: 'Failed to update roles',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleTermsSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">Roles</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            This is your roles within Changeling VR.
          </CardDescription>
          <div className="flex flex-row flex-wrap gap-4">
            {ROLE_VALUES.map((role) => (
              <div key={role} className="flex flex-row items-center gap-1">
                <Checkbox
                  id={role}
                  value={role}
                  checked={roles.includes(role.toLowerCase())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRoles([...roles, role.toLowerCase()]);
                    } else {
                      setRoles(roles.filter((r) => r !== role.toLowerCase()));
                    }
                  }}
                />
                <Label htmlFor={role} className="text-sm">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please select at least one role.</p>
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
