import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { upvoteSchema } from '@/lib/validator';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  const userId = session?.id;

  try {
    if (!userId) {
      return new NextResponse('Not logged in', {
        status: 401,
        statusText: 'Please login to vote',
      });
    }

    const body = await req.json();
    const { postId } = upvoteSchema.parse(body);

    const existingVote = await db.upvote.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingVote) {
      return new NextResponse('Error', {
        status: 409,
        statusText: 'Already upvoted',
      });
    }

    // https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api
    await db.$transaction([
      db.upvote.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      }),

      db.post.update({
        where: { id: postId },
        data: {
          upvoteCount: {
            increment: 1,
          },
        },
      }),
    ]);

    revalidatePath('/');
    // return new Response('OK');
    return NextResponse.json({ revalidated: true, now: new Date() });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new NextResponse(e.message, { status: 400 });
    }
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
