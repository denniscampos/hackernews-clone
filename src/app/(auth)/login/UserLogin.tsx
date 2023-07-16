'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type SignInProps = {
  username: string;
  password: string;
};

export function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('callbackUrl') ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>();

  const onSubmit = async ({ username, password }: SignInProps) => {
    setIsLoading(true);
    const payload = {
      username,
      password,
    };

    const response = await signIn('credentials', {
      redirect: false,
      ...payload,
    });

    if (response?.error !== null) {
      setAuthError(response?.error);
      setIsLoading(false);
      return;
    }

    if (response?.ok) {
      router.push(search);
      router.refresh();
    }

    setIsLoading(false);
    return response;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="username">username</Label>
      <Input {...register('username')} type="text" />
      {errors.username && (
        <p className="text-red-500">{errors.username.message}</p>
      )}
      <Label htmlFor="password">password</Label>
      <Input {...register('password')} type="password" />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      {authError && <p className="text-red-500">{authError}</p>}
      <Button className="mt-3" disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="flex animate-spin" /> : 'Sign in'}
      </Button>
    </form>
  );
}
