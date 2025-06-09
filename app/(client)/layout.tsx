import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './_components/theme-provider';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="text-primary">{children}</div>
      <Toaster richColors />
    </ThemeProvider>
  );
}
