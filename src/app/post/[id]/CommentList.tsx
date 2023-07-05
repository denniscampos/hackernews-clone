'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentSchema } from '@/lib/validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export function CommentList({
  commentId,
  commentChildren,
  postId,
}: {
  commentId: string;
  commentChildren?: {
    id: string;
    parentId: string;
    content: string;
    children: {
      id: string;
      content: string;
    }[];
  }[];
  postId: string;
}) {
  const [content, setContent] = useState('');
  const [replyTextArea, setReplyTextArea] = useState(false);
  const commentMutation = useMutation({
    mutationKey: ['nestedComment'],
    mutationFn: async ({ postId, content, parentId }: CommentSchema) => {
      const payload = {
        postId,
        content,
        parentId,
      };

      const { data } = await axios.post('/api/comment/create', payload);

      return data;
    },
  });

  return (
    <div className="ml-10">
      {commentChildren?.map(
        (child) =>
          child.parentId === commentId && (
            <div key={child.id}>
              <p>{child.content}</p>
              {!replyTextArea ? (
                <>
                  <Button
                    disabled={commentMutation.isLoading}
                    className="underline"
                    variant="link"
                    onClick={() => {
                      setReplyTextArea(true);
                    }}
                  >
                    reply
                  </Button>
                </>
              ) : (
                <div>
                  <Textarea onChange={(e) => setContent(e.target.value)} />
                  <Button
                    disabled={commentMutation.isLoading}
                    className="underline"
                    variant="link"
                    onClick={() => {
                      commentMutation.mutate({
                        postId: postId,
                        content,
                        parentId: child.id,
                      });
                    }}
                  >
                    reply
                  </Button>
                  <Button
                    disabled={commentMutation.isLoading}
                    className="underline"
                    variant="link"
                    onClick={() => {
                      setReplyTextArea(false);
                    }}
                  >
                    cancel
                  </Button>
                </div>
              )}
              {child.children?.map((nestedComment) => (
                <div key={nestedComment.id}>
                  <p>{nestedComment.content}</p>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}
