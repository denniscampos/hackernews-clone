'use client';

import { CommentSchema } from '@/lib/validator';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { getTimeSincePostCreation } from '@/lib/utils';

type CommentProps = {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  user: {
    id: string;
    username: string | null;
  };
  children: {
    id: string;
    postId: string;
    content: string;
  }[];
}[];

export function CommentSection({ comments }: { comments?: CommentProps }) {
  const [reply, setReply] = useState('');
  // Array to track reply state for each comment
  const [isReplying, setIsReplying] = useState<boolean[]>([]);
  const router = useRouter();

  const replyMutation = useMutation({
    mutationKey: ['reply'],
    mutationFn: async ({ postId, content, parentId }: CommentSchema) => {
      const payload = {
        postId,
        content,
        parentId,
      };
      const { data } = await axios.post(`/api/comment/create`, payload);
      return data;
    },
    onSettled: () => {
      router.refresh();
      setIsReplying([false]);
    },
  });

  // Utility function to update the reply state for a specific comment
  const setReplyingState = (index: number, value: boolean) => {
    const updatedIsReplying = [...isReplying];
    updatedIsReplying[index] = value;
    setIsReplying(updatedIsReplying);
  };

  return (
    <div>
      {comments?.map((comment, index) => (
        <div key={comment.id}>
          {comment.parentId === null && (
            <>
              <div className="border border-gray-100">
                <span className="inline">{comment.user.username}</span>{' '}
                <span>{getTimeSincePostCreation(comment.createdAt)}</span>
                <p>{comment.content}</p>
              </div>
              {!isReplying[index] ? (
                <Button
                  onClick={() => setReplyingState(index, true)}
                  variant="link"
                >
                  reply
                </Button>
              ) : (
                <div>
                  <Textarea onChange={(e) => setReply(e.target.value)} />
                  <Button
                    onClick={() => {
                      replyMutation.mutate({
                        postId: comment.postId,
                        content: reply,
                        parentId: comment.id || undefined,
                      });
                    }}
                    variant="link"
                  >
                    reply
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setReplyingState(index, false)}
                  >
                    cancel
                  </Button>
                </div>
              )}
            </>
          )}

          {comment.children?.map((child) => (
            <div key={child.id} className="ml-10">
              <NestedComment
                comment={child}
                setReply={setReply}
                reply={reply}
                replyMutation={replyMutation}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NestedComment({
  comment,
  reply,
  setReply,
  replyMutation,
}: {
  comment: any;
  reply: string;
  setReply: (reply: string) => void;
  replyMutation: UseMutationResult<
    any,
    unknown,
    {
      postId: string;
      content: string;
      parentId?: string | undefined;
    },
    unknown
  >;
}) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div key={comment.id}>
      <p>{comment.content}</p>
      {!isReplying ? (
        <div>
          <Button variant="link" onClick={() => setIsReplying(true)}>
            reply
          </Button>
        </div>
      ) : (
        <div>
          <Textarea onChange={(e) => setReply(e.target.value)} />
          <Button
            variant="link"
            onClick={() => {
              replyMutation.mutate({
                postId: comment.postId,
                content: reply,
                parentId: comment.id || undefined,
              });
              setIsReplying(false);
            }}
          >
            reply
          </Button>
          <Button variant="link" onClick={() => setIsReplying(false)}>
            cancel
          </Button>
        </div>
      )}
    </div>
  );
}
