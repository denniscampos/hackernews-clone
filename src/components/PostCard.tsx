import Link from 'next/link';
import { Button } from './ui/button';
import { Prisma } from '@prisma/client';
import { getTimeSincePostCreation } from '@/lib/utils';
import { postSelect } from '@/lib/prisma/validator';

type PostCardPayload = Prisma.PostGetPayload<typeof postSelect>;

export function PostCard({ posts }: { posts: PostCardPayload[] }) {
  return (
    <div className="p-2">
      {posts.map((post) => (
        <div key={post.title} className="mb-2">
          <div>
            <Link href="/">
              <Button className="hover:bg-transparent p-0 h-0" variant="ghost">
                {post.title}
              </Button>
            </Link>
            <Link href="/">
              <Button
                className="text-xs text-[#828282] py-0 pl-2 h-0"
                variant="link"
              >
                ({post.url})
              </Button>
            </Link>
          </div>
          <div className="leading-[0px]">
            <span className="text-xs text-[#828282]">
              92 points by {post.author.username}{' '}
              <span>{getTimeSincePostCreation(post.createdAt)}</span> | 98
              comments
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
