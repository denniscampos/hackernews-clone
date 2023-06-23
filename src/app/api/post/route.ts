import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { postValidatorSchema } from '@/lib/validator';
import { z } from 'zod';

export async function POST(req: Request) {
  const session = await getCurrentUser();
  try {
    const body = await req.json();
    console.log({ body });
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

    return new Response(JSON.stringify(post), { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    return new Response('something', { status: 500 });
  }
}
