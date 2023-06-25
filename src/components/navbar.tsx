'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { SignIn } from './sign-in';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';

type NavbarProps = {
  items?: {
    title: string;
    href: string;
    external?: boolean;
    disabled?: boolean;
  }[];
  user?: User | null;
};

export function Navbar({ items, user }: NavbarProps) {
  const userName = user?.username;
  const pathname = usePathname();

  if (pathname === '/login') {
    return <></>;
  }

  return (
    <nav className="flex justify-between text-xs bg-[#FF6600]">
      <div className="flex items-center">
        <Link href="/">
          <Button
            variant="ghost"
            className="font-bold p-2 hover:bg-transparent"
          >
            Hacker News
          </Button>
        </Link>
        {items?.map(
          (item, index) =>
            item.href && (
              <Link key={index} href={item.href}>
                <Button className="p-2" variant="link">
                  {item.title}
                </Button>
              </Link>
            )
        )}
      </div>

      <div className="flex">
        <Link href="/account">
          <Button className="hover:bg-transparent p-0" variant="ghost">
            {!user ? null : userName ? userName : 'Account'}
          </Button>
        </Link>
        <SignIn user={user} />
      </div>
    </nav>
  );
}
