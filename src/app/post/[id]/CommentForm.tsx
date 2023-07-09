'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type CommentSchema } from '@/lib/validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommentSection } from './CommentSection';
import { type CommentProps } from './types';

export function CommentForm({
  postId,
  comments,
}: {
  postId: string;
  comments?: CommentProps;
}) {
  const [content, setContent] = useState('');
  const router = useRouter();
  const commentMutation = useMutation({
    mutationKey: ['comment'],
    mutationFn: async ({ postId, content, parentId }: CommentSchema) => {
      const payload = {
        postId,
        content,
        parentId,
      };

      const { data } = await axios.post('/api/comment/create', payload);
      return data;
    },
    onSettled: () => {
      setContent('');
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
          }}
        >
          add comment
        </Button>
        <div>
          <CommentSection comments={comments} />
        </div>
      </div>
    </div>
  );
}
