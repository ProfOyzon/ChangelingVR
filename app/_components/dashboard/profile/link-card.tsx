'use client';

import { useState } from 'react';
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa6';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { deleteProfileLink, updateProfileLink } from '@/lib/auth/actions';
import type { ProfileLink } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  github: <FaGithub className="size-5" />,
  linkedin: <FaLinkedin className="size-5" />,
  email: <FaEnvelope className="size-5" />,
  website: <FaGlobe className="size-5" />,
};

export function LinkCard({ platform, link }: { platform: string; link?: ProfileLink }) {
  const [url, setUrl] = useState(link?.url || '');
  const [visible, setVisible] = useState(link?.visible ?? true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url === link?.url && visible === link?.visible) return;

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('platform', platform);
    formData.append('url', url || '');
    formData.append('visible', visible.toString());

    if (!url) {
      return toast.promise(deleteProfileLink({}, formData), {
        loading: `Deleting ${platform} link...`,
        success: `${platform} link deleted successfully`,
        error: `Failed to delete ${platform} link`,
      });
    }

    toast.promise(updateProfileLink({}, formData), {
      loading: `Updating ${platform} link...`,
      success: `${platform} link updated successfully`,
      error: `Failed to update ${platform} link`,
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card className="flex flex-row items-center justify-between p-3.5">
        <CardContent className="flex flex-row items-center gap-4 p-0">
          <CardTitle className="flex w-20 flex-row items-center gap-1">
            {iconMap[platform]}
            <span className="text-sm font-medium">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          </CardTitle>
          <CardDescription className="flex flex-row items-center gap-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`Enter your ${platform} URL`}
              className={cn('w-[300px]', !url ? 'text-muted-foreground' : 'text-foreground')}
            />
            <Switch checked={visible} onCheckedChange={setVisible} disabled={!url} />
          </CardDescription>
        </CardContent>
        <CardFooter className="p-0">
          <SubmitButton className="w-full" pendingText="Saving...">
            Save
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
