import { PostCard } from '@/components/PostCard';
import { getCurrentUser } from '@/lib/session';
import { getLatestPosts } from '@/services/posts';

export default async function Page() {
  const user = await getCurrentUser();
  const data = await getLatestPosts();

  return (
    <div>
      <PostCard posts={data} user={user} />
    </div>
  );
}
