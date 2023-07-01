import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { commentSchema } from '@/lib/validator';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    const body = await req.json();
    const { content, postId } = commentSchema.parse(body);

    await db.comment.create({
      data: {
        content,
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
    });

    return new NextResponse('ok', { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
