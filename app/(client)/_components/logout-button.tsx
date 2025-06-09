'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth/actions';

export function LogoutButton() {
  return (
    <Button type="submit" className="w-full" onClick={() => logout()}>
      <LogOut />
      <span>Log out</span>
    </Button>
  );
}
