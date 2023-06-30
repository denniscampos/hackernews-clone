'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { getTimeSincePostCreation } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { type UpvoteSchema } from '@/lib/validator';
import { useRouter } from 'next/navigation';

export type PostCardProps = {
  upvoteCount: number;
  id: string;
  title: string;
  url: string | null;
  text: string | null;
  createdAt: Date;
  author: {
    username: string | null;
  };
}[];

// type PostCardPayload = Prisma.PostGetPayload<typeof postSelect>;

export function PostCard({ posts }: { posts: PostCardProps }) {
  const router = useRouter();
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
      alert('upvoted');
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

  const handleVote = ({ postId }: UpvoteSchema) => {
    upvoteMutation.mutate({ postId });
    router.refresh();
  };

  return (
    <div className="p-2">
      {posts.map((post) => (
        <div key={post.id} className="flex">
          <div>
            <button onClick={() => handleVote({ postId: post.id })}>
              <div className="w-0 h-0 mr-1 border-l-[5px] border-l-transparent border-b-[10px] border-b-gray-500 border-r-[5px] border-r-transparent"></div>
            </button>
          </div>
          <div className="mb-2">
            <div className="flex items-center">
              <Link href="/">
                <Button
                  className="hover:bg-transparent p-0 h-0"
                  variant="ghost"
                >
                  {post.title}
                </Button>
              </Link>
              <Link href="/">
                <Button
                  className="text-xs text-[#828282] py-0 pl-2 h-0"
                  variant="link"
                >
                  ({post.url})
                </Button>
              </Link>
            </div>
            <div className="leading-[0px]">
              <span className="text-xs text-[#828282]">
                {post.upvoteCount} points by {post.author.username}{' '}
                <span>{getTimeSincePostCreation(post.createdAt)}</span> | 98
                comments
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
