import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { upvoteSchema } from '@/lib/validator';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id;

  try {
    const body = await req.json();
    const { postId } = upvoteSchema.parse(body);

    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
        upvoteCount: true,
      },
    });

    if (userId !== post?.authorId) {
      return new NextResponse('Not authorized', {
        status: 401,
        statusText: 'Only the user can unvote the current post',
      });
    } else {
      const existingUpvote = await db.upvote.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (!existingUpvote) {
        throw new Error('Upvote not found for the user');
      }

      if (!post?.upvoteCount) {
        throw new Error('Post upvote count not found');
      }

      // so that it doesn't go below 0
      if (post.upvoteCount > 0) {
        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            upvoteCount: {
              decrement: 1,
            },
          },
          include: {
            upvote: true,
          },
        });
        await db.upvote.delete({
          where: {
            id: existingUpvote?.id,
          },
        });
      }
    }

    return new NextResponse('Success', {
      status: 200,
      statusText: 'Unvote successful',
    });
  } catch (error) {
    return new NextResponse('Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
