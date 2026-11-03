import { useCommentStore } from "@/features/comment/commentStore";

const handleAddLike = async (commentId, isReply, userId) => {
  const addLike = useCommentStore((state) => state.addLike);

  if (!commentId || !userId) return;

  try {
    await addLike(commentId, isReply, userId);
  } catch (err) {
    console.error("Failed to add like:", err);
  }
};

export default handleAddLike;
