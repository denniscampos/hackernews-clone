'use client';

import { Icons } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { UserLogin } from './UserLogin';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type SignUpProps = {
  username: string;
  password: string;
  confirmPassword: string;
};

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: SignUpProps) => {
    setIsLoading(true);
    try {
      const { username, password, confirmPassword } = data;
      const payload = {
        username,
        password,
        confirmPassword,
        signUp: true,
      };

      const res = await signIn('credentials', {
        redirect: false,
        ...payload,
      });

      if (res) {
        const { error, ok } = res;

        if (error) {
          throw new Error('something went wrong.');
        }

        if (ok) {
          console.log('success');
          router.push('/');
          router.refresh();
        }
      }
    } catch (e) {
      console.log('something went wrong', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
      router.refresh();
    } catch (e) {
      console.log('Something went wrong', { catch: { e } });
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 max-w-xs">
      <span className="font-bold">Login</span>
      <div className="mb-5">
        <UserLogin />
      </div>
      <span className="font-bold">Create Account</span>
      {/* @ts-expect-error */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="username">Username</Label>
        <Input
          {...register('username')}
          id="username"
          name="username"
          type="username"
        />

        <Label htmlFor="password">Password</Label>
        <Input
          {...register('password')}
          id="password"
          name="password"
          type="password"
        />

        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          {...register('confirmPassword')}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />
        <Button disabled={isLoading} className="mb-10 mt-3">
          {isLoading ? <Loader2 /> : 'Sign up'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div>
        <Button
          disabled={isGithubLoading}
          className="w-full mt-3"
          onClick={handleGithubLogin}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          {isGithubLoading ? <Loader2 /> : 'Github'}
        </Button>
      </div>
    </div>
  );
}
