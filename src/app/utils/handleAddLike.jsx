import { useContentStore } from "@/features/content/contentStore";

const handleAddLike = async (commentId, isReply, userId) => {
  const { addLike } = useContentStore((state) => state.addLike);

  if (!commentId || !userId) return;

  try {
    await addLike(commentId, isReply, userId);
  } catch (err) {
    console.error("Failed to add like:", err);
  }
};

export default handleAddLike;
