import { PostSubmitForm } from '@/components/PostSubmitForm';
import { authOptions } from '@/lib/authOptions';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Submit() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?callbackUrl=/submit' || '/login');
  }

  return (
    <>
      <PostSubmitForm />
    </>
  );
}
