import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { accountValidatorSchema } from '@/lib/validator';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Reference: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#request-body

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json();

  try {
    const { email, username, about } = accountValidatorSchema.parse(body);

    const createPost = await db.user.upsert({
      where: {
        id: user?.id,
      },
      update: {
        username,
        about,
        email,
      },
      create: {
        username,
        about,
        email,
      },
    });

    return NextResponse.json(createPost, { status: 201 });
  } catch (error) {
    console.error({ error });
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(error);
  }
}
