'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AccountFormRequest, accountValidatorSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function AccountForm({ user }: { user?: User | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormRequest>({
    defaultValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      about: user?.about ?? '',
    },
    resolver: zodResolver(accountValidatorSchema),
  });

  const onSubmit = async (data: AccountFormRequest) => {
    setIsLoading(true);
    const payload = {
      username: data.username,
      about: data.about,
      email: data.email,
    };

    try {
      const { data } = await axios.post('/api/account', payload);
      router.refresh();
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        alert(e.response?.status);
      }
      alert(e);
    } finally {
      setIsLoading(false);
    }
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
                {errors.username && <span>{errors.username.message}</span>}
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
                {errors.about && <span>{errors.about.message}</span>}
              </td>
            </tr>
            <tr>
              <td>email</td>
              <td>
                <Input
                  {...register('email')}
                  disabled={user?.email ? true : false}
                  name="email"
                  type="email"
                  placeholder="email"
                />
                {errors.email && <span>{errors.email.message}</span>}
              </td>
            </tr>
          </tbody>
        </table>
        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Updating' : 'Update'}
        </Button>
      </form>
    </div>
  );
}
