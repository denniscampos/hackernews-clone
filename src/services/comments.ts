import { db } from '@/lib/db';

// Although this is fetching posts, the main purpose is to fetch comments
export const fetchPostData = async (params: { id: string }) => {
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
    orderBy: { createdAt: 'desc' },
  });

  return { post, comments };
};
