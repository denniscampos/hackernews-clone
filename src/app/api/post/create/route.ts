import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { postValidatorSchema } from '@/lib/validator';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  try {
    const body = await req.json();
    const { title, url, text } = postValidatorSchema.parse(body);

    if (!session) return;

    const post = await db.post.create({
      data: {
        title,
        url,
        text,
        authorId: session?.id as string,
      },
    });

    return NextResponse.json({ post, revalidated: true, now: Date.now() });
  } catch (e) {
    console.log({ e });
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    return new Response('something', { status: 500 });
  }
}
