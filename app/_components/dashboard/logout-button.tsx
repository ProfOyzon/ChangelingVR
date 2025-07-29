import { LogOut } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';
import { logout } from '@/lib/auth/actions';

export function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton className="w-full">
        <LogOut />
        <span>Log out</span>
      </SubmitButton>
    </form>
  );
}
