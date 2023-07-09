import { getTimeSincePostCreation } from '@/lib/utils';
import { CommentForm } from './CommentForm';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// TODO: get proper type for the data below
// type PostProps = {
//   id: string;
//   title: string;
//   url: string;
//   upvoteCount: number;
//   createdAt: Date;
//   author: {
//     username: string;
//   };
//   comment: {
//     id: string;
//     content: string;
//     createdAt: Date;
//     user: {
//       username: string;
//     };
//     parentId: string;
//     children: {
//       id: string;
//       parentId: string;
//       content: string;
//       children: {
//         id: string;
//         content: string;
//       }[];
//     }[];
//   }[];
// };

export default async function Page({ params }: { params: { id: string } }) {
  const fetchPostData = async () => {
    const post = await db.post.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        url: true,
        upvoteCount: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
        comment: {
          select: {
            id: true,
          },
        },
      },
    });

    const comments = await db.comment.findMany({
      where: {
        postId: post?.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        children: {
          select: {
            id: true,
            content: true,
            parentId: true,
            postId: true,
            createdAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { post, comments };
  };

  const { post } = await fetchPostData();
  const { comments } = await fetchPostData();

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
