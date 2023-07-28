import axios from 'axios';

export const allPosts = async ({
  take,
  lastCursor,
  params,
}: {
  take?: number;
  lastCursor?: string;
  params?: string;
}) => {
  if (params === '/new') {
    const { data } = await axios.get('/api/latestPosts', {
      params: { take, lastCursor },
    });

    return data;
  }

  const { data } = await axios.get('/api/posts', {
    params: { take, lastCursor },
  });

  return data;
};
