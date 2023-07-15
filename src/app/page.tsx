import { PostCard } from '@/components/PostCard';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div>
      <PostCard user={user} />
    </div>
  );
}
