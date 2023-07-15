import { getCurrentUser } from '@/lib/session';
import { AccountForm } from './AccountForm';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?callbackUrl=/account' || '/');
  }

  return <AccountForm user={user} />;
}
