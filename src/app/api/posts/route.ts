import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';
import { NextResponse } from 'next/server';

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
    return NextResponse.json(postsWithUpvoteCount, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
