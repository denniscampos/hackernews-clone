'use client';

import { Icons } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function UserAuthForm() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <h1>Create an account</h1>
      <p>Enter your email below to create your account</p>
      <Button className="mb-10">Sign in with email</Button>

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
          className="w-full"
          onClick={() => signIn('github', { callbackUrl: '/' })}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Github
        </Button>
      </div>
    </div>
  );
}
