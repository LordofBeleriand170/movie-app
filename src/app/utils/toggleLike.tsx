import { Comment } from "@/types/comment";
import handleAddLike from "./handleAddLike";
import { Reply } from "@/features/content/contentStore";

const toggleLike = (
  item: Reply | Comment,
  id: string | undefined,
  isReply: boolean,
) => {
  if (!id || !item) return;

  const userIdStr = id.toString();

  const likesList = isReply
    ? (item as Reply).replyLikes || []
    : (item as Comment).commentLikes || [];

  const hasLiked = likesList.some((like) => like.userId === userIdStr);

  // 3. Keep the type consistent with the likes array structure
  let updatedLikes: [];

  if (hasLiked) {
    updatedLikes = likesList.filter((like) => like.userId !== userIdStr);
  } else {
    const newLike = isReply
      ? { userId: userIdStr, replyId: item.id }
      : { userId: userIdStr, commentId: item.id };

    updatedLikes = [...likesList, newLike];
  }

  if (isReply) {
    (item as Reply).replyLikes = updatedLikes;
  } else {
    (item as Comment).commentLikes = updatedLikes;
  }

  handleAddLike(item.id, isReply);
};

export default toggleLike;
