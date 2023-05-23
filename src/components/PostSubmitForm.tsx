import { db } from '@/lib/db';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Prisma } from '@prisma/client';
import { User } from 'next-auth';

export async function PostSubmitForm({ user }: { user?: User }) {
  async function postForm(data: FormData): Promise<void> {
    'use server';

    const { title, url, text } = Object.fromEntries(
      data
    ) as unknown as Prisma.PostCreateInput;

    const userTest = await db.user.findFirst({
      where: {
        email: user?.email,
      },
    });

    await db.post.create({
      data: {
        title,
        url,
        text,
        authorId: userTest?.id as string,
      },
    });
  }

  return (
    <div className="p-4">
      <form action={postForm}>
        <div className="flex items-center">
          <Label className="pr-2">title</Label>
          <Input id="title" name="title" />
        </div>

        <div className="flex items-center">
          <Label className="pr-2">url</Label>
          <Input id="url" name="url" />
        </div>

        <div className="flex items-center">
          <Label className="pr-2">text</Label>
          <Textarea id="text" name="text" />
        </div>
        <Button type="submit">submit</Button>
      </form>
    </div>
  );
}
