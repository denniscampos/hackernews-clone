export type CommentProps = {
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
    parentId: string | null;
    createdAt: Date;
    user: {
      username: string | null;
    };
  }[];
}[];

export type NestedCommentProps = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  postId: string;
  user: {
    username: string | null;
  };
};
