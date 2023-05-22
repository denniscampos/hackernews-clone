import Link from 'next/link';
import { Button } from './ui/button';

export function PostCard() {
  return (
    <div className="p-2">
      <div>
        <Link href="/">
          <Button className="hover:bg-transparent p-0 h-0" variant="ghost">
            some random news article title
          </Button>
        </Link>
        <Link href="/">
          <Button
            className="text-xs text-[#828282] py-0 pl-2 h-0"
            variant="link"
          >
            (google.co)
          </Button>
        </Link>
      </div>
      <div className="leading-[0px]">
        <span className="text-xs text-[#828282]">
          92 points by Narla 2 hours ago | 98 comments
        </span>
      </div>
    </div>
  );
}
