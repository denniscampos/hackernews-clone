'use client';

import { User } from 'next-auth';
import { Button } from './ui/button';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SignIn({
  user,
}: {
  user?: Pick<User, 'name' | 'email' | 'image'>;
}) {
  const router = useRouter();
  return (
    <>
      {user ? (
        <Button
          variant="link"
          onClick={() => {
            signOut({ callbackUrl: '/' });
            router.refresh();
          }}
        >
          logout
        </Button>
      ) : (
        <Button
          variant="link"
          onClick={() => {
            signIn('github');
            router.refresh();
          }}
        >
          login
        </Button>
      )}
    </>
  );
}
