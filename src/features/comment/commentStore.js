import { create } from "zustand";
import Sentiment from "sentiment";
const sentimentAnalyzer = new Sentiment();

export const useCommentStore = create((set, get) => ({
  error: null,
  loading: true,
  comments: [],
  content: [],
  aiSummary: null,
  aiLoading: true,
  aiError: null,
  sentimentScore: null,

  addComment: async (user, movieId, commentText, rating, type, spoiler) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          movieId,
          text: commentText,
          mediaType: type,
          rating: rating,
          spoiler,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      else {
        set((state) => ({
          comments: [
            ...state.comments,
            { ...data.comment, username: user.username },
          ],
        }));
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  },

  addRespond: async (user, commentId, respond, rating) => {
    try {
      const res = await fetch(`/api/comments/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          text: respond,
          id: user.id,
          username: user.username,
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error("Failed to add comment");
      else {
        const latestReply =
          data?.comment?.replies[data?.comment?.replies?.length - 1];

        set((state) => ({
          comments: state?.comments?.map((comment) =>
            comment?._id === commentId
              ? {
                  ...comment,
                  replies: [...(comment?.replies || []), latestReply],
                }
              : comment,
          ),
        }));
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  },

  fetchComments: async (movieId, mediaType) => {
    set({ comments: [], aiSummary: null, aiLoading: true, aiError: null });
    mediaType = mediaType === "movies" ? "movie" : "tv";
    try {
      const res = await fetch(`/api/comments/contentComments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, mediaType }),
      });
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      const fetchedComments = data.contentComments || [];

      let totalScore = 0;
      fetchedComments.forEach((c) => {
        const result = sentimentAnalyzer.analyze(c.text || "");
        totalScore += result.score;
      });
      const avgScore =
        fetchedComments.length > 0 ? totalScore / fetchedComments.length : 0;

      set({
        comments: fetchedComments,
        sentimentScore: avgScore,
      });
    } catch (err) {
      console.error("Fetch comments error:", err);
      set({ error: err, aiLoading: false, aiSummary: null });
    }
  },

  getCommentInfo: async (commentId) => {
    set({ content: [], loading: true, error: null });

    try {
      const res = await fetch(`/api/comments/getComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching comment");
      }

      const data = await res.json();

      set({
        content: data,
        error: null,
        loading: false,
      });

      return data || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error", loading: false });
      return [];
    }
  },
  deleteComment: async (id, isComment) => {
    try {
      const res = await fetch(`/api/comments/deleteComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isComment }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle ban:`, err);
    }
  },
  fetchAiSummary: async (movieId, mediaType, contentTitle) => {
    const { comments } = get();
    if (!comments || comments.length < 3) return;

    set({ aiLoading: true, aiError: null });

    try {
      const res = await fetch(`/api/analyze-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments, movieId, mediaType, contentTitle }),
      });

      if (!res.ok) {
        throw new Error(`AI API failed: ${res.status}`);
      }

      const data = await res.json();
      set({ aiSummary: data?.summary, aiLoading: false });
    } catch (err) {
      console.error("fetchAiSummary error:", err);
      set({
        aiError: err instanceof Error ? err.message : "AI Summary failed",
        aiLoading: false,
        aiSummary: null,
      });
    }
  },
  addLike: async (commentId, isReply, userId) => {
    try {
      const res = await fetch("/api/comments/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          isReply,
          id: userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      set((state) => ({
        comments: state.comments.map((c) => {
          if (!isReply && c._id === data.comment._id) {
            return {
              ...c,
              likes: data.comment.likes,
            };
          }

          if (isReply) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r._id === data.reply._id
                  ? { ...r, likes: data.reply.likes }
                  : r,
              ),
            };
          }

          return c;
        }),
      }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  },
}));
