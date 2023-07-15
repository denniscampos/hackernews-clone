'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { formatURL, getTimeSincePostCreation } from '@/lib/utils';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { type UpvoteSchema } from '@/lib/validator';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { Loader2 } from 'lucide-react';
import { PAGE_SIZE } from '@/constants';

export type PostCardProps = {
  id: string;
  title: string;
  url: string | null;
  text: string | null;
  createdAt: Date;
  upvoteCount: number;
  commentCount: number;
  author: {
    id: string;
    username: string | null;
  };
  upvote: {
    userId: string;
  }[];
};

// type PostCardPayload = Prisma.PostGetPayload<typeof postSelect>;

const allPosts = async ({
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

export function PostCard({ user }: { user?: User | null }) {
  const queryClient = useQueryClient();
  const path = usePathname();

  const nextPageQueryResults = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = '' }) => {
      const data = await allPosts({
        take: PAGE_SIZE,
        lastCursor: pageParam,
        params: path,
      });

      return data;
    },
    getNextPageParam: (nextPage) => {
      return nextPage.lastCursor;
    },
  });

  const upvoteMutation = useMutation({
    mutationKey: ['upvote'],
    mutationFn: async (postId: UpvoteSchema) => {
      const payload = {
        postId,
      };
      const { data } = await axios.post('/api/post/vote', payload.postId);
      return data;
    },
    onSuccess: () => {
      //invaidate cache
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          alert('Already upvoted');
        }
        if (error.response?.status === 401) {
          alert('Please log in to vote');
        }
        if (error.response?.status === 500) {
          alert('Something went wrong');
        }
      } else {
        alert('An error occured. Please try again later');
      }
    },
  });

  const unvoteMutation = useMutation({
    mutationKey: ['unvote'],
    mutationFn: async (postId: UpvoteSchema) => {
      const payload = {
        postId,
      };
      const { data } = await axios.post('/api/post/unvote', payload.postId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          alert('Something went wrong');
        }
      }
    },
  });

  const handleVote = ({ postId }: UpvoteSchema) => {
    upvoteMutation.mutate({ postId });
  };

  if (nextPageQueryResults.isLoading) {
    return (
      <div className="flex justify-center mt-10 w-full">
        <Loader2 className="flex animate-spin" />
      </div>
    );
  }

  const posts = nextPageQueryResults.data?.pages;

  return (
    <div className="p-2">
      {posts?.map((page, pageIndex) =>
        page?.data.map((post: PostCardProps, index: number) => (
          <div key={post.id} className="flex">
            <span className="mr-1 text-sm">
              {index + 1 + pageIndex * PAGE_SIZE}.
            </span>
            <div>
              {post.upvote.find(
                (upvote) => upvote.userId === user?.id
              ) ? null : (
                <button onClick={() => handleVote({ postId: post.id })}>
                  <div className="w-0 h-0 mr-1 border-l-[5px] border-l-transparent border-b-[10px] border-b-gray-500 border-r-[5px] border-r-transparent"></div>
                </button>
              )}
            </div>
            <div className="mb-2">
              <div className="flex items-center">
                <Link href={post.url ?? '/'}>
                  <span className="text-sm">{post.title}</span>
                </Link>
                <Link href={post.url ?? '/'}>
                  <Button
                    className="text-xs text-[#828282] py-0 pl-2 h-0"
                    variant="link"
                  >
                    ({formatURL(post.url)})
                  </Button>
                </Link>
              </div>
              <div className="leading-[0px]">
                <span className="text-xs text-[#828282]">
                  {`${post.upvoteCount} ${
                    post.upvoteCount === 1 ? 'point by' : 'points by'
                  }`}{' '}
                  {post.author.username}{' '}
                  <span>{getTimeSincePostCreation(post.createdAt)}</span>
                  {post.upvote.find((upvote) => upvote.userId === user?.id) ? (
                    <>
                      |{' '}
                      <button
                        disabled={unvoteMutation.isLoading}
                        onClick={() =>
                          unvoteMutation.mutate({ postId: post.id })
                        }
                      >
                        unvote
                      </button>
                    </>
                  ) : null}
                  |{' '}
                  <Link className="hover:underline" href={`/post/${post.id}`}>
                    {`${post.commentCount} ${
                      post.commentCount === 1 ? 'comment' : 'comments'
                    }`}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        ))
      )}
      <Button
        className="mt-5"
        disabled={
          !nextPageQueryResults.hasNextPage ||
          nextPageQueryResults.isFetchingNextPage
        }
        onClick={async () => {
          await nextPageQueryResults.fetchNextPage();
        }}
      >
        {nextPageQueryResults.isFetchingNextPage ? (
          <Loader2 className="flex animate-spin" />
        ) : nextPageQueryResults.hasNextPage ? (
          'More'
        ) : (
          'No more posts'
        )}
      </Button>
    </div>
  );
}
