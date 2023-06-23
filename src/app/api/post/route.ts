import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { z } from 'zod';

export const PostValidatorSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  text: z.string(),
});

export type PostValidator = z.infer<typeof PostValidatorSchema>;

export async function POST(req: Request) {
  const session = await getCurrentUser();
  try {
    const body = await req.json();
    console.log({ body });
    const { title, url, text } = PostValidatorSchema.parse(body);

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
