export interface PostItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userId: number;
}

export interface CommentType {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}
