import { useMovieStore } from "@/features/movie/movieStore";

const handleAddLike = async (commentId, isReply, userId) => {
  const { addLike } = useMovieStore.getState();

  console.log("USER ID: ", userId);

  if (!commentId || !userId) return;

  try {
    await addLike(commentId, isReply, userId);
  } catch (err) {
    console.error("Failed to add like:", err);
  }
};

export default handleAddLike;
