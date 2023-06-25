import { PostCard } from '@/components/PostCard';
import { env } from '@/env.mjs';

async function getPosts() {
  const res = fetch(`${env.BASE_URL}/api/posts`);

  return (await res).json();
}

export default async function Home() {
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} />
    </div>
  );
}
