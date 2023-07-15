import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor');

    const firstQueryResults = await db.post.findMany({
      take: take ? parseInt(take) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: { id: lastCursor },
      }),
      orderBy: { createdAt: 'desc' },
      ...postSelect,
    });

    const postsWithUpvoteCount = firstQueryResults.map(
      ({ _count, ...post }) => {
        return {
          ...post,
          upvoteCount: _count.upvote,
          commentCount: _count.comment,
        };
      }
    );

    if (postsWithUpvoteCount.length === 0) {
      return new Response(
        JSON.stringify({ data: [], lastCursor: null, next: false }),
        { status: 200 }
      );
    }

    const lastPostInResults =
      postsWithUpvoteCount[postsWithUpvoteCount.length - 1];
    const myCursor = lastPostInResults.id;

    const nextPage = await db.post.findMany({
      take: take ? parseInt(take) : 10,
      skip: 1,
      cursor: { id: myCursor },
      orderBy: { createdAt: 'desc' },
      ...postSelect,
    });

    const nextPostsWithUpvoteCount = nextPage.map(({ _count, ...post }) => {
      return {
        ...post,
        upvoteCount: _count.upvote,
        commentCount: _count.comment,
      };
    });

    const data = {
      data: postsWithUpvoteCount,
      lastCursor: myCursor,
      next: nextPostsWithUpvoteCount.length > 0,
    };

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
