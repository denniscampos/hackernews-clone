import { PostCard, PostCardProps } from '@/components/PostCard';
import { env } from '@/env.mjs';
import { getCurrentUser } from '@/lib/session';

async function getPosts() {
  const res = await fetch(`${env.BASE_URL}/api/posts`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data = (await res.json()) as PostCardProps;

  return data;
}

export default async function Home() {
  const user = await getCurrentUser();
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} user={user} />
    </div>
  );
}
