'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { FormMessage } from '@/components/form-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { updateProfileSchema } from '@/lib/auth/validator';
import { cn } from '@/lib/utils';
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

type ValidationErrors = Record<string, string>;
type CharacterCounts = {
  username: number;
  display_name: number;
  bio: number;
};

const CharacterCount = ({ current, max }: { current: number; max: number }) => (
  <span className="text-muted-foreground text-xs">
    {current}/{max}
  </span>
);

const ValidationError = ({ message }: { message: string }) => (
  <p className="mt-1 text-xs text-red-500">{message}</p>
);

const FormField = ({
  label,
  id,
  name,
  value,
  maxLength,
  error,
  count,
  tooltip,
  children,
}: {
  label: string;
  id: string;
  name: string;
  value: string;
  maxLength: number;
  error?: string;
  count: number;
  tooltip: string;
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
      <CharacterCount current={count} max={maxLength} />
    </div>
    {children || (
      <Input
        id={id}
        name={name}
        defaultValue={value}
        className={cn('w-full', error && 'border-red-500')}
        maxLength={maxLength}
      />
    )}
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [counts, setCounts] = useState<CharacterCounts>({
    username: 0,
    display_name: 0,
    bio: 0,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (profile) {
      setCounts({
        username: profile.username?.length || 0,
        display_name: profile.display_name?.length || 0,
        bio: profile.bio?.length || 0,
      });
    }
  }, [profile]);

  const validateForm = useCallback((formData: FormData) => {
    const data = Object.fromEntries(formData);
    const result = updateProfileSchema.safeParse(data);

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

  const handleChange = useCallback(() => {
    if (!formRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const formData = new FormData(formRef.current!);
      if (validateForm(formData)) {
        mutation.mutate(formData);
      }
    }, 300);
  }, [mutation, validateForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCounts((prev) => ({ ...prev, [name]: value.length }));
    handleChange();
  };

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
    <form ref={formRef} onChange={handleChange} className="flex flex-col gap-6">
      <FormField
        label="Username"
        id="username"
        name="username"
        value={profile.username}
        maxLength={USERNAME_MAX}
        error={validationErrors.username}
        count={counts.username}
        tooltip="Your unique identifier. This will be used in your profile URL and mentions."
      >
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">@</span>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username}
            className={cn('pl-7', validationErrors.username && 'border-red-500')}
            placeholder="Enter your username"
            maxLength={USERNAME_MAX}
            onChange={handleInputChange}
          />
        </div>
      </FormField>

      <FormField
        label="Display Name"
        id="display_name"
        name="display_name"
        value={profile.display_name || ''}
        maxLength={DISPLAY_NAME_MAX}
        error={validationErrors.display_name}
        count={counts.display_name}
        tooltip="The name that will be shown to other users. This can be your real name or a nickname."
      >
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name || ''}
          className={cn('w-full', validationErrors.display_name && 'border-red-500')}
          placeholder="Enter your display name"
          maxLength={DISPLAY_NAME_MAX}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField
        label="Bio"
        id="bio"
        name="bio"
        value={profile.bio || ''}
        maxLength={BIO_MAX}
        error={validationErrors.bio}
        count={counts.bio}
        tooltip="A brief description about yourself. This will be visible on your profile page."
      >
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ''}
          className={cn('w-full', validationErrors.bio && 'border-red-500')}
          rows={3}
          placeholder="Tell us about yourself..."
          maxLength={BIO_MAX}
          onChange={handleInputChange}
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
