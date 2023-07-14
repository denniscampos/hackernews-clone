import { PostCard } from '@/components/PostCard';
import { getCurrentUser } from '@/lib/session';
import { getPosts } from '../services/posts';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const user = await getCurrentUser();
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} user={user} />
    </div>
  );
}
