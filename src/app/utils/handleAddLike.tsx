import { useCollectionStore } from "@/features/collection/collectionStore";
import { useMovieStore } from "@/features/movie/movieStore";

const handleAddLike = async (
  commentId: string | undefined,
  isReply: boolean,
) => {
  const { user } = useCollectionStore.getState();
  const { addLike } = useMovieStore.getState();

  if (!commentId || !user || !user.email) return;

  try {
    await addLike(user, commentId, isReply);
  } catch (err) {
    console.error("Failed to add like:", err);
  }
};

export default handleAddLike;
