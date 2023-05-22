import { db } from '@/lib/db';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Prisma } from '@prisma/client';
import { User } from 'next-auth';

export async function PostSubmitForm({
  user,
}: {
  user?: Pick<User, 'id' | 'email'>;
}) {
  async function postForm(data: FormData): Promise<any> {
    'use server';

    const { title, url, text } = Object.fromEntries(
      data
    ) as unknown as Prisma.PostCreateInput;

    //TODO: may not work well do do this type of connect with use server.

    await db.post.create({
      data: {
        title,
        url,
        text,
        author: {
          connect: {
            id: user?.id,
          },
        },
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
