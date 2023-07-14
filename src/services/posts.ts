import { db } from '@/lib/db';
import { postSelect } from '@/lib/prisma/validator';

export const getPosts = async () => {
  const findPosts = await db.post.findMany({
    orderBy: { upvoteCount: 'desc' },
    ...postSelect,
  });

  const postsWithUpvoteCount = findPosts.map(({ _count, ...post }) => {
    return {
      ...post,
      upvoteCount: _count.upvote,
      commentCount: _count.comment,
    };
  });

  return postsWithUpvoteCount;
};

export const getLatestPosts = async () => {
  const findLatestPosts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    ...postSelect,
  });

  const postsWithUpvoteCount = findLatestPosts.map(({ _count, ...post }) => {
    return {
      ...post,
      upvoteCount: _count.upvote,
      commentCount: _count.comment,
    };
  });

  return postsWithUpvoteCount;
};
