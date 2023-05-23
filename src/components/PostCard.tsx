import Link from 'next/link';
import { Button } from './ui/button';
import { Post } from '@prisma/client';

export function PostCard({
  posts,
}: {
  posts: Pick<Post, 'title' | 'url' | 'text'>[];
}) {
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
              92 points by Narla 2 hours ago | 98 comments
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
