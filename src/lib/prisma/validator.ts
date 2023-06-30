import { Prisma } from '@prisma/client';

export const postSelect = Prisma.validator<Prisma.PostArgs>()({
  select: {
    id: true,
    createdAt: true,
    title: true,
    url: true,
    text: true,
    author: {
      select: {
        username: true,
      },
    },
    _count: {
      select: {
        upvote: true,
      },
    },
  },
});
