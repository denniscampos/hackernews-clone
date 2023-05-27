'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'next-auth';
import { useForm } from 'react-hook-form';

export function AccountForm({ user }: { user?: User | null }) {
  const { register, handleSubmit } = useForm<{
    email: string;
    username: string;
    about: string;
  }>({
    defaultValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      about: user?.about ?? '',
    },
  });

  const onSubmit = async (data: { username: string; about: string }) => {
    await fetch('/api/account', {
      method: 'POST',
      body: JSON.stringify({
        email: user?.email,
        username: data.username,
        about: data.about,
      }),
    });
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <tbody>
            <tr>
              <td>username: </td>
              <td>
                <Input {...register('username')} />
              </td>
            </tr>
            <tr>
              <td>Karma </td>
              <td>1</td>
            </tr>
            <tr>
              <td>About: </td>
              <td>
                <Textarea {...register('about')} />
              </td>
            </tr>
            <tr>
              <td>email</td>
              <td>
                <Input
                  {...register('email')}
                  name="email"
                  type="email"
                  placeholder="email"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
