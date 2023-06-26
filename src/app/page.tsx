import { PostCard } from '@/components/PostCard';
import { env } from '@/env.mjs';
import { postSelect } from '@/lib/prisma/validator';
import { Prisma } from '@prisma/client';

async function getPosts() {
  const res = await fetch(`${env.BASE_URL}/api/posts`, {
    next: { tags: ['posts'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data = (await res.json()) as Prisma.PostGetPayload<typeof postSelect>[];

  return data;
}

export default async function Home() {
  const data = await getPosts();
  return (
    <div>
      <PostCard posts={data} />
    </div>
  );
}
