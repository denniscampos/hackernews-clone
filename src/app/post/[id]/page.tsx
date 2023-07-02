import { getTimeSincePostCreation } from '@/lib/utils';
import { CommentForm } from './CommentForm';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
// import axios from 'axios';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type PostProps = {
  id: string;
  title: string;
  url: string;
  upvoteCount: number;
  createdAt: Date;
  author: {
    username: string;
  };
  comment: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  }[];
};

export default async function Page({ params }: { params: { id: string } }) {
  const fetchPost = async () => {
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
            content: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return post;
  };
  const post = (await fetchPost()) as PostProps;
  const comments = post?.comment?.map((comment) => comment);

  return (
    <div>
      {post && (
        <div>
          <p>{post.title}</p>
          <span>{post.url}</span>
          <span>{post.upvoteCount}</span>
          <span>{getTimeSincePostCreation(post.createdAt)}</span>
          <span>{post.author?.username}</span>
          <CommentForm postId={post.id} comments={comments} />
        </div>
      )}
    </div>
  );
}
