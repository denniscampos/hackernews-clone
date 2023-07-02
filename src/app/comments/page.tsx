import { env } from '@/env.mjs';

type CommentsProps = {
  id: string;
  content: string;
};

export default async function Page() {
  const fetchComments = async () => {
    'use server';
    const res = await fetch(`${env.BASE_URL}/api/comment`);

    const data = (await res.json()) as CommentsProps[];

    return data;
  };

  const comments = await fetchComments();
  return (
    <div>
      <h1 className="font-bold text-xl">Work in progress.</h1>
      {comments.map((comment) => (
        <div key={comment.id}>
          <h2>{comment.content}</h2>
        </div>
      ))}
    </div>
  );
}
