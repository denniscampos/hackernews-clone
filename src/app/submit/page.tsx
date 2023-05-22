import { PostSubmitForm } from '@/components/PostSubmitForm';
import { getCurrentUser } from '@/lib/session';

export default async function Submit() {
  const user = await getCurrentUser();

  console.log(user?.email);

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <PostSubmitForm user={user} />
    </>
  );
}
