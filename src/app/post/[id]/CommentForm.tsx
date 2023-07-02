'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getTimeSincePostCreation } from '@/lib/utils';
import { type CommentSchema } from '@/lib/validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CommentProps = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    username: string | null;
  };
}[];

export function CommentForm({
  postId,
  comments,
}: {
  postId: string;
  comments: CommentProps;
}) {
  const [content, setContent] = useState('');
  const router = useRouter();
  const commentMutation = useMutation({
    mutationKey: ['comment'],
    mutationFn: async ({ postId, content }: CommentSchema) => {
      const payload = {
        postId,
        content,
      };

      const { data } = await axios.post('/api/comment/create', payload);
      return data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div>
      <div className="my-5">
        <Textarea onChange={(e) => setContent(e.target.value)} />
        <Button
          className="mt-3"
          onClick={() => {
            commentMutation.mutate({
              postId,
              content,
            });
            setContent('');
          }}
        >
          add comment
        </Button>
      </div>

      <div>
        {comments?.map((comment) => (
          <div className="flex flex-col my-3" key={comment.id}>
            <div>
              <div className="inline-flex w-0 h-0 mr-1 border-l-[5px] border-l-transparent border-b-[10px] border-b-gray-500 border-r-[5px] border-r-transparent"></div>
              <span className="mr-1">{comment.user.username}</span>
              <span className="text-sm">
                {getTimeSincePostCreation(comment.createdAt)}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
