'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type CommentSchema } from '@/lib/validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CommentProps = {
  id: string;
  content: string;
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
      <div>
        <Textarea onChange={(e) => setContent(e.target.value)} />
        <Button
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
          <div key={comment.id}>{comment.content}</div>
        ))}
      </div>
    </div>
  );
}
