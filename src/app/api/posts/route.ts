import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      ...postSelect,
    });
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
