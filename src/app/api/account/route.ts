import { db } from '@/lib/db';
import { accountValidatorSchema } from '@/lib/validator';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Reference: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#request-body

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { email, username, about } = accountValidatorSchema.parse(body);

    const createPost = await db.user.update({
      where: {
        email,
      },
      data: {
        username,
        about,
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
