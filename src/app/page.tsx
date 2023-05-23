import { PostCard } from '@/components/PostCard';
import { db } from '@/lib/db';

export default async function Home() {
  const posts = await db.post.findMany({});

  return (
    <div>
      <PostCard posts={posts} />
    </div>
  );
}
