import { getCurrentUser } from '@/lib/session';
import { AccountForm } from './AccountForm';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages?.signIn || '/');
  }

  return <AccountForm user={user} />;
}
