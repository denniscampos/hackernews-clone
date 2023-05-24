import { PostCard } from '@/components/PostCard';
import { db } from '@/lib/db';

export default async function Home() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <PostCard posts={posts} />
    </div>
  );
}
