import { getCurrentUser } from '@/lib/session';
import { UserAuthForm } from './UserAuthForm';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return <UserAuthForm />;
}
