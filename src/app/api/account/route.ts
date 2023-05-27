import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Reference: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#request-body

export async function POST(request: Request) {
  const res = await request.json(); // apparently contains the body?
  const createPost = await db.user.update({
    where: {
      email: res.email,
    },
    data: {
      username: res.username,
      about: res.about,
    },
  });

  return NextResponse.json(createPost);
}
