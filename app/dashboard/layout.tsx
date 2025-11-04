import { Metadata } from 'next';
import { LogoutButton } from '@/app/dashboard/logout-button';
import { Submenu } from '@/app/dashboard/submenu';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard of your account on Changeling VR',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-dune sticky top-16 z-100 flex flex-row items-center justify-between">
        <div className="flex flex-initial touch-pan-x flex-row items-center justify-start overflow-x-scroll">
          <Submenu />
        </div>

        <div className="bg-dune flex shrink-0 items-center justify-end border-gray-500 px-2 max-md:border-l md:px-4">
          <LogoutButton />
        </div>
      </div>

      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
