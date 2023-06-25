'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <Button disabled={isLoading} type="submit">
        Sign in
      </Button>
    </form>
  );
}
