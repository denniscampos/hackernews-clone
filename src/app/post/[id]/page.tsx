import { getTimeSincePostCreation } from '@/lib/utils';
import { CommentForm } from './CommentForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchPostData } from '@/services/comments';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Page({ params }: { params: { id: string } }) {
  const { post, comments } = await fetchPostData({ id: params.id });

  return (
    <div className="mt-5">
      {post && (
        <div className="p-2">
          <div className="flex items-center mb-1">
            <div className="w-0 h-0 mr-1 border-l-[5px] border-l-transparent border-b-[10px] border-b-gray-500 border-r-[5px] border-r-transparent"></div>
            <p className="text-sm">{post.title}</p>
            <Link href={post.url || ''}>
              <Button
                className="text-xs text-[#828282] py-0 pl-2 h-0"
                variant="link"
              >
                ({post.url})
              </Button>
            </Link>
          </div>
          <div className="flex mb-1 gap-2">
            <span className="text-sm">
              {post.upvoteCount === 1
                ? '1 point'
                : `${post.upvoteCount} points`}
            </span>
            <span className="text-sm">
              {getTimeSincePostCreation(post.createdAt)}
            </span>
            <span className="text-sm">by {post.author?.username}</span>
            <span className="text-sm">
              {`${post.comment.length} ${
                post.comment.length === 1 ? 'comment' : 'comments'
              }`}{' '}
            </span>
          </div>
          <CommentForm postId={post.id} comments={comments} />
        </div>
      )}
    </div>
  );
}
