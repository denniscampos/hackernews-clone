import { z } from 'zod';

export const accountValidatorSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  about: z.string().max(500),
});

export type AccountFormRequest = z.infer<typeof accountValidatorSchema>;

export const postValidatorSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  text: z.string(),
});

export type PostValidator = z.infer<typeof postValidatorSchema>;

export const upvoteSchema = z.object({
  postId: z.string(),
});

export type UpvoteSchema = z.infer<typeof upvoteSchema>;

export const commentSchema = z.object({
  postId: z.string(),
  content: z.string(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
