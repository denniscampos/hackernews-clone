import { PostCard, PostCardProps } from '@/components/PostCard';
import { env } from '@/env.mjs';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const getPosts = async () => {
    const res = await fetch(`${env.BASE_URL}/api/posts`);

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = (await res.json()) as PostCardProps;

    return data;
  };
  const user = await getCurrentUser();
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} user={user} />
    </div>
  );
}
