import Link from 'next/link';
import { Button } from './ui/button';
import { getCurrentUser } from '@/lib/session';
import { SignIn } from './sign-in';

type NavbarProps = {
  items?: {
    title: string;
    href: string;
    external?: boolean;
    disabled?: boolean;
  }[];
};

export async function Navbar({ items }: NavbarProps) {
  const user = await getCurrentUser();
  const firstName = user?.name?.split(' ')[0];

  return (
    <nav className="flex justify-between text-xs bg-[#FF6600]">
      <div className="flex items-center">
        <h1 className="font-bold p-2">Hacker News</h1>
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

      <div>
        <span>{firstName}</span>
        <SignIn user={user} />
      </div>
    </nav>
  );
}
