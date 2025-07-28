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
import { processFormData, processZodError, zTermsSchema } from '@/lib/auth/validator';
import type { Profile } from '@/lib/db/schema';

const years = [...Array(new Date().getFullYear() - 2019)].map(
  (_, i) => new Date().getFullYear() - i,
);

export function TermsSection({ profile }: { profile: Profile }) {
  const [terms, setTerms] = useState<number[]>(profile.terms || []);
  const mutation = useProfileMutation();

  const handleTermsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terms === profile.terms) return;

    // Pass the terms as a stringified array to the form data
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('terms', JSON.stringify(terms));

    // Validate the form data
    const result = zTermsSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating terms...',
        success: 'Terms updated successfully',
        error: 'Failed to update terms',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleTermsSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">Terms</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            This is your terms within Changeling VR.
          </CardDescription>
          <div className="flex flex-row flex-wrap gap-4">
            {years.map((year) => (
              <div key={year} className="flex flex-row items-center gap-1">
                <Checkbox
                  id={year.toString()}
                  value={year}
                  checked={terms.includes(year)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTerms([...terms, year]);
                    } else {
                      setTerms(terms.filter((t) => t !== year));
                    }
                  }}
                />
                <Label htmlFor={year.toString()} className="text-sm">
                  {year.toString()}
                </Label>
              </div>
            ))}
          </div>
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please select at least one term.</p>
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
