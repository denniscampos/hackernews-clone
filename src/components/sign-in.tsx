'use client';

import { User } from 'next-auth';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignIn({ user }: { user?: User | null }) {
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
        <Link href="/login">
          <Button variant="link">login</Button>
        </Link>
      )}
    </>
  );
}
