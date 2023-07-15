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

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { id: true, username: true, email: true },
    });

    const isUsernameTaken =
      existingUser && existingUser.username !== user?.username;
    const isEmailTaken = existingUser && existingUser.email !== user?.email;

    // Check if the existingUser.id is the same as user.id (same user)
    const isSameUser = existingUser && existingUser.id === user?.id;

    if ((isEmailTaken || isUsernameTaken) && !isSameUser) {
      return NextResponse.json(
        { error: 'Username or email already taken' },
        { status: 409 }
      );
    }

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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(error);
  }
}
