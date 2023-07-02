import { getTimeSincePostCreation } from '@/lib/utils';
import { CommentForm } from './CommentForm';
import { env } from '@/env.mjs';
// import axios from 'axios';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type PostProps = {
  id: string;
  title: string;
  url: string;
  upvoteCount: number;
  createdAt: Date;
  author: {
    username: string;
  };
  comment: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  }[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const fetchPost = async () => {
    const url = `${env.BASE_URL}/api/post/?id=${searchParams.id}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }

    const data = (await res.json()) as PostProps;
    return data;
    // const { data } = await axios.get(`${env.BASE_URL}/api/post`, {
    //   params: {
    //     id: searchParams.id,
    //   },
    // });

    // return data;
  };
  const post = (await fetchPost()) as PostProps;
  const comments = post?.comment?.map((comment) => comment);

  return (
    <div>
      {post && (
        <div>
          <p>{post.title}</p>
          <span>{post.url}</span>
          <span>{post.upvoteCount}</span>
          <span>{getTimeSincePostCreation(post.createdAt)}</span>
          <span>{post.author?.username}</span>
          <CommentForm postId={post.id} comments={comments} />
        </div>
      )}
    </div>
  );
}
