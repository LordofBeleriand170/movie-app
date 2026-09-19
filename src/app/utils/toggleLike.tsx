import { Comment } from "@/types/comment";
import handleAddLike from "./handleAddLike";

const toggleLike = (comment: Comment, id: string, isReply: boolean) => {
  if (!id) return;

  const userIdStr = id.toString();

  let hasLiked;

  if (isReply) {
    hasLiked = comment?.replyLikes?.some((like) => {
      return like.userId === userIdStr;
    });
  } else {
    hasLiked = comment?.comment?.commentLikes?.some((like) => {
      return like.userId === userIdStr;
    });
  }

  let updatedLikes: string[];

  if (hasLiked) {
    if (isReply) {
      updatedLikes = (comment?.replyLikes || []).filter(
        (like) => like.userId !== userIdStr,
      );
    } else {
      updatedLikes = (comment?.comment?.commentLikes || []).filter(
        (like) => like.userId !== userIdStr,
      );
    }
  } else {
    if (isReply) {
      updatedLikes = [
        ...(comment?.replyLikes || []),
        { userId: userIdStr, replyId: comment?.id },
      ];
    } else {
      updatedLikes = [
        ...(comment?.comment?.commentLikes || []),
        { userId: userIdStr, commentId: comment?.comment?.id },
      ];
    }
  }

  if (comment?.comment) {
    comment.comment.commentLikes = updatedLikes;
  } else {
    comment.replyLikes = updatedLikes;
  }

  handleAddLike(comment?.comment?.id || comment?.id, isReply, mediaId);
};

export default toggleLike;
