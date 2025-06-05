'use client';

import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs defaultValue={theme ?? 'system'} onValueChange={(val) => setTheme(val)}>
      <TabsList>
        <TabsTrigger value="light">
          <span className="sr-only">Light</span>
          <Sun className="h-4 w-4" aria-hidden />
        </TabsTrigger>
        <TabsTrigger value="system">
          <span className="sr-only">System</span>
          <Monitor className="h-4 w-4" aria-hidden />
        </TabsTrigger>
        <TabsTrigger value="dark">
          <span className="sr-only">Dark</span>
          <Moon className="h-4 w-4" aria-hidden />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ModeToggle;
