'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { toast } from 'sonner';
import { FormMessage } from '@/components/form-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileMutation, useProfileQuery } from '@/hooks/use-profile';
import { zUpdateProfileSchema } from '@/lib/auth/validator';
import { cn } from '@/lib/utils';

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

type ValidationErrors = Record<string, string>;

const ValidationError = ({ message }: { message: string }) => (
  <p className="text-destructive mt-1 text-xs">{message}</p>
);

const FormField = ({
  id,
  label,
  tooltip,
  error,
  children,
}: {
  id: string;
  label: string;
  tooltip: string;
  error?: string;
  children?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FaCircleInfo className="text-muted-foreground hover:text-foreground size-[12px] transition-colors" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    {children}
    {error && <ValidationError message={error} />}
  </div>
);

const CheckboxGroup = ({
  label,
  items,
  name,
  defaultValues,
}: {
  label: string;
  items: readonly string[];
  name: string;
  defaultValues?: string[];
}) => (
  <div className="flex-1 space-y-2">
    <Label>{label}</Label>
    <ScrollArea className="h-[100px] rounded-md border p-2 md:h-90">
      <div className="grid grid-cols-1 gap-1">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`${name}-${item}`}
              name={name}
              value={item.toLowerCase()}
              defaultChecked={defaultValues?.includes(item.toLowerCase())}
            />
            <Label htmlFor={`${name}-${item}`} className="text-sm font-normal capitalize">
              {item}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfileQuery();
  const mutation = useProfileMutation();
  const formRef = useRef<HTMLFormElement>(null);
  const mutationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((formData: FormData) => {
    const data = Object.fromEntries(formData);
    const result = zUpdateProfileSchema.safeParse(data);

    if (!result.success) {
      const errors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, []);

  const handleInput = useCallback(() => {
    if (!formRef.current) return;

    // Validate immediately
    const formData = new FormData(formRef.current);
    validateForm(formData);

    // Clear existing timeout
    if (mutationTimeoutRef.current) {
      clearTimeout(mutationTimeoutRef.current);
    }

    // Set new timeout for update
    mutationTimeoutRef.current = setTimeout(() => {
      if (validateForm(formData)) {
        toast.promise(mutation.mutateAsync(formData), {
          loading: 'Updating profile...',
          success: 'Profile updated successfully',
          error: 'Failed to update profile',
        });
      }
    }, 1000);
  }, [mutation, validateForm]);

  useEffect(() => {
    return () => {
      if (mutationTimeoutRef.current) {
        clearTimeout(mutationTimeoutRef.current);
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
        <h1 className="text-destructive text-2xl font-bold">Error loading profile</h1>
        <p className="text-muted-foreground">{error?.message || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onInput={handleInput}
      onChange={handleInput}
      className="flex flex-col gap-6"
    >
      <FormField
        id="username"
        label="Username"
        tooltip="Your unique identifier. This will be used in your profile URL and mentions."
        error={validationErrors.username}
      >
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">@</span>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username}
            className={cn(
              'pl-7',
              validationErrors.username && 'border-destructive focus-visible:ring-destructive',
            )}
            placeholder="Enter your username"
            maxLength={15}
          />
        </div>
      </FormField>

      <FormField
        id="display_name"
        label="Display Name"
        tooltip="The name that will be shown to other users. This can be your real name or a nickname."
        error={validationErrors.display_name}
      >
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name || ''}
          className={cn('w-full', validationErrors.display_name && 'border-destructive')}
          placeholder="Enter your display name"
          maxLength={50}
        />
      </FormField>

      <FormField
        id="bio"
        label="Bio"
        tooltip="A brief description about yourself. This will be visible on your profile page."
        error={validationErrors.bio}
      >
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ''}
          className={cn('w-full', validationErrors.bio && 'border-destructive')}
          rows={3}
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
      </FormField>

      <div className="flex flex-col gap-6 md:flex-row">
        <CheckboxGroup
          label="Terms"
          items={Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) =>
            (new Date().getFullYear() - i).toString(),
          )}
          name="terms"
          defaultValues={profile.terms?.map(String) || undefined}
        />

        <CheckboxGroup
          label="Teams"
          items={TEAM_VALUES}
          name="teams"
          defaultValues={profile.teams || undefined}
        />

        <CheckboxGroup
          label="Roles"
          items={ROLE_VALUES}
          name="roles"
          defaultValues={profile.roles || undefined}
        />
      </div>

      {mutation.error && <FormMessage type="error" message={mutation.error.message} />}
    </form>
  );
}
