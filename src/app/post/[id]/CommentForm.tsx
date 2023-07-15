'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type CommentSchema } from '@/lib/validator';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommentSection } from './CommentSection';
import { type CommentProps } from './types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function CommentForm({
  postId,
  comments,
}: {
  postId: string;
  comments?: CommentProps;
}) {
  const [content, setContent] = useState('');
  const router = useRouter();
  const { toast } = useToast();

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
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400) {
          // we only care about the content here.
          toast({
            variant: 'destructive',
            title: 'Oops',
            description: e.response.data.error[0].message,
          });

          return;
        }

        if (e.response?.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Oops',
            description: e.response.data.error,
          });
          return;
        }
      }
    },
  });

  return (
    <div>
      <div className="my-5">
        <Textarea onChange={(e) => setContent(e.target.value)} />
        <Button
          disabled={commentMutation.isLoading}
          className="mt-3"
          onClick={() => {
            commentMutation.mutate({
              postId,
              content,
            });
          }}
        >
          {commentMutation.isLoading ? (
            <Loader2 className="flex animate-spin" />
          ) : (
            'add comment'
          )}
        </Button>
        <div>
          <CommentSection comments={comments} />
        </div>
      </div>
    </div>
  );
}
