import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';

export async function GET() {
  try {
    const findPosts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      ...postSelect,
    });

    const postsWithUpvoteCount = findPosts.map(({ _count, ...post }) => {
      return {
        ...post,
        upvoteCount: _count.upvote,
      };
    });
    return new Response(JSON.stringify(postsWithUpvoteCount), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
