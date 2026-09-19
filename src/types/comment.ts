import { Reply } from "@/features/content/contentStore";

export type Comment = {
  commentLikes: string[];
  replyLikes: string[];
  like: number;
  image: string;
  replies: Reply[];
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
  createdAt?: string | undefined;
  spoilers: boolean;
  comment: {
    commentLikes: {
      like: {
        userId: string;
      };
    }[];
    id: string;
    image: string;
    isDeleted: boolean;
    username: string;
    userId: string;
    rating: number;
    updatedAt: string;
    spoilers: boolean;
    text: string;
    replies: Reply[];
  };
};
