'use client';

import { CommentSchema } from '@/lib/validator';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { getTimeSincePostCreation } from '@/lib/utils';
import { type CommentProps, type NestedCommentProps } from './types';

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
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400) {
          // we only care about the content here.
          alert(e.response.data.error[0].message);
          return;
        }

        if (e.response?.status === 401) {
          alert(e.response.data.error);
          return;
        }
      }
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
              <div className="text-xs mt-5">
                <span className="inline font-bold">
                  {comment.user.username}
                </span>{' '}
                <span>{getTimeSincePostCreation(comment.createdAt)}</span>
                <p className="text-xs">{comment.content}</p>
              </div>
              {!isReplying[index] ? (
                <Button
                  className="text-xs p-0"
                  onClick={() => setReplyingState(index, true)}
                  variant="link"
                >
                  reply
                </Button>
              ) : (
                <div>
                  <Textarea
                    className="mt-3 text-sm"
                    placeholder={`replying to ${comment.user.username}`}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button
                    className="text-xs p-0"
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
                    className="text-xs"
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
  comment: NestedCommentProps;
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
  console.log({ comment });

  return (
    <div key={comment.id}>
      <div className="text-xs font-bold">
        <span>{comment.user?.username}</span>{' '}
        <span>{getTimeSincePostCreation(comment.createdAt)}</span>
      </div>
      <p className="text-xs">{comment.content}</p>
      {!isReplying ? (
        <div>
          <Button
            className="text-xs p-0"
            variant="link"
            onClick={() => setIsReplying(true)}
          >
            reply
          </Button>
        </div>
      ) : (
        <div>
          <Textarea
            className="mt-3 text-sm"
            placeholder={`replying to ${comment.user.username}`}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            className="text-xs"
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
          <Button
            className="text-xs"
            variant="link"
            onClick={() => setIsReplying(false)}
          >
            cancel
          </Button>
        </div>
      )}
    </div>
  );
}
