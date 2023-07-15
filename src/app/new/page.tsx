import { PostCard } from '@/components/PostCard';
import { getCurrentUser } from '@/lib/session';

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div>
      <PostCard user={user} />
    </div>
  );
}
