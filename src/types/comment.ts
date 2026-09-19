export type Comment = {
  commentLikes: string[];
  replyLikes: string[];
  like: number;
  image: string;
  replies: Comment[];
  _id?: string;
  id: string;
  movieId: number;
  userId: string;
  username: string;
  rating: number;
  likes: number;
  comments: number;
  text: string;
  mediaId: string;
  createdAt?: string;
  spoilers: boolean;
};
