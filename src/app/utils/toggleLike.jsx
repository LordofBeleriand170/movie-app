import handleAddLike from "./handleAddLike";

const toggleLike = (target, userId, isReply) => {
  if (!userId || !target) return;
  const userIdStr = userId.toString();
  const targetId = target?.id;

  if (isReply) {
    const likesList = target?.replyLikes || [];
    const hasLiked = likesList.some((like) => like.userId === userIdStr);

    target.replyLikes = hasLiked
      ? likesList.filter((like) => like.userId !== userIdStr)
      : [...likesList, { userId: userIdStr, replyId: targetId }];
  } else {
    const likesList = target?.commentLikes || [];
    const hasLiked = likesList.some((like) => like.userId === userIdStr);

    target.commentLikes = hasLiked
      ? likesList.filter((like) => like.userId !== userIdStr)
      : [...likesList, { userId: userIdStr, commentId: targetId }];
  }

  handleAddLike(targetId, isReply, userId);
};

export default toggleLike;
