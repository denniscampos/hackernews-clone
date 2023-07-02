import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('id');

  try {
    const post = await db.post.findUnique({
      where: {
        id: postId as string,
      },
      select: {
        id: true,
        title: true,
        url: true,
        upvoteCount: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
