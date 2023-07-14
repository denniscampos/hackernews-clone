'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type SignInProps = {
  username: string;
  password: string;
};

export function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignInProps>();

  const onSubmit = async ({ username, password }: SignInProps) => {
    setIsLoading(true);
    const payload = {
      username,
      password,
    };

    const response = await signIn('credentials', {
      callbackUrl: '/',
      ...payload,
    });

    setIsLoading(false);
    return response;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="username">username</Label>
      <Input {...register('username')} type="text" />
      <Label htmlFor="password">password</Label>
      <Input {...register('password')} type="password" />
      <Button className="mt-3" disabled={isLoading} type="submit">
        {isLoading ? <Loader2 /> : 'Sign in'}
      </Button>
    </form>
  );
}
