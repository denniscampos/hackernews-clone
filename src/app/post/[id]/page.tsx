import { db } from '@/lib/db';
import { getTimeSincePostCreation } from '@/lib/utils';
import { CommentForm } from './CommentForm';

export default async function Page({ params }: { params: { id: string } }) {
  const fetchPost = async () => {
    'use server';
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
      },
    });

    return post;
  };

  const fetchComments = async () => {
    'use server';

    const fetchComments = await db.post.findMany({
      where: {
        id: params.id,
      },
      select: {
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
    return fetchComments;
  };
  const post = await fetchPost();
  const comments = await fetchComments();

  return (
    <div>
      {post && (
        <div>
          <p>{post.title}</p>
          <span>{post.url}</span>
          <span>{post.upvoteCount}</span>
          <span>{getTimeSincePostCreation(post.createdAt)}</span>
          <span>{post.author.username}</span>
          <CommentForm postId={post.id} comments={comments} />
        </div>
      )}
    </div>
  );
}
