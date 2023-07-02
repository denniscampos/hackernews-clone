import { PostCard } from '@/components/PostCard';
import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const getPosts = async () => {
    const findPosts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      ...postSelect,
    });

    const postsWithUpvoteCount = findPosts.map(({ _count, ...post }) => {
      return {
        ...post,
        upvoteCount: _count.upvote,
        commentCount: _count.comment,
      };
    });

    return postsWithUpvoteCount;
  };
  const user = await getCurrentUser();
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} user={user} />
    </div>
  );
}
