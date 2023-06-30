import { PostCard, PostCardProps } from '@/components/PostCard';
import { env } from '@/env.mjs';

async function getPosts() {
  const res = await fetch(`${env.BASE_URL}/api/posts`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data = (await res.json()) as PostCardProps;

  return data;
}

export default async function Home() {
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} />
    </div>
  );
}
