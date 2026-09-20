import { create } from "zustand";

export const useMovieStore = create((set) => ({
  results: [],
  movies: [],
  movie: null,
  videos: [],
  loading: true,
  category: [],
  total_pages: 0,
  total_results: 0,
  input: null,
  error: null,
  comments: [],

  trending: async (mediaType, page, options) => {
    set({ movies: [], error: null });

    try {
      const res = await fetch("/api/trending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, page }),
        signal: options?.signal,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching trending items");
      }

      const data = await res.json();

      set({
        movies: data?.results || [],
        total_pages: data?.total_pages || 0,
        total_results: data?.total_results || 0,
        error: null,
      });

      return data.results || [];
    } catch (err) {
      if (err.name === "AbortError") return [];

      console.error("Failed to fetch trending:", err);
      set({ error: err?.message || "Unknown error" });
      return [];
    }
  },

  trendingVideos: async (mediaType, page, options) => {
    set({ videos: [], error: null });

    try {
      const res = await fetch("/api/trending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, page }),
        signal: options?.signal,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching trending items");
      }

      const data = await res.json();

      set({
        videos: data?.results || [],
        total_pages: data?.total_pages || 0,
        total_results: data?.total_results || 0,
        error: null,
      });

      return data.results || [];
    } catch (err) {
      if (err.name === "AbortError") return [];

      console.error("Failed to fetch trending:", err);
      set({ error: err?.message || "Unknown error" });
      return [];
    }
  },

  search: async (input, page) => {
    set({ error: null });

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, page }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error searching movies");
      }

      const data = await res.json();

      set({
        movies: data?.result || [],
        total_pages: data?.total_pages || 0,
        total_results: data?.total_results || 0,
        error: null,
      });

      return data?.result || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      return [];
    }
  },

  optionFetch: async (filter) => {
    set({ error: null });
    let type = filter.mediaType;
    try {
      const res = await fetch(`/api/${type}/option`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching filtered options");
      }

      const data = await res.json();

      set({
        movies: data?.result || [],
        total_pages: data?.total_pages || 0,
        total_results: data?.total_results || 0,
        error: null,
      });

      return data?.result?.results || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      return [];
    }
  },

  genre: async (filter) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/genre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching filtered options");
      }

      const data = await res.json();

      set({
        movies: data?.result || [],
        total_pages: data?.total_pages || 0,
        total_results: data?.total_results || 0,
        error: null,
      });

      return data?.result?.results || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      return [];
    }
  },

  fetchInfo: async (id, type) => {
    set({ error: null });

    try {
      const res = await fetch(`/api/${type}/getInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching movie info");
      }

      const data = await res.json();

      set({
        movie: data?.results || data || [],
        error: null,
      });

      return data?.results || data || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      return [];
    }
  },

  getCategory: async (mediaType, id) => {
    set({ error: null });
    let type = mediaType;
    try {
      const res = await fetch(`/api/${type}/getCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching category");
      }

      const data = await res.json();

      set({
        category: data || [],
        error: null,
      });

      return data || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      return [];
    }
  },

  similar: async (id, type) => {
    set({ movies: [], error: null });
    try {
      type = type === "movies" ? "movie" : "tv";

      const res = await fetch(`/api/${type}/similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching similar");
      }

      const data = await res.json();

      set({
        movies: data?.results || [],
        error: null,
        loading: false,
      });

      return data?.results || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error", loading: false });
      return [];
    }
  },

  fetchComments: async (movieId, mediaType) => {
    mediaType = mediaType === "movies" ? "movie" : "tv";
    try {
      const res = await fetch(
        `/api/comments?mediaId=${movieId}&mediaType=${mediaType}`,
      );
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();

      set({ comments: data.comments || [] });
    } catch (err) {
      console.error("Fetch comments error:", err);
      set({ comments: [] });
    }
  },

  addComment: async (user, movieId, commentText, rating, type, spoiler) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          text: commentText,
          id: user.id,
          username: user.username,
          mediaType: type,
          rating: rating,
          spoiler,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      set((state) => ({
        comments: [
          ...state.comments,
          { ...data.comment, username: user.username },
        ],
      }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  },

  addRespond: async (user, commentId, respond) => {
    try {
      const res = await fetch(`/api/comments/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: commentId,
          text: respond,
          id: user.id,
          username: user.username,
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      const latestReply = data?.reply;

      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), latestReply],
              }
            : comment,
        ),
      }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  },

  addLike: async (user, commentId, isReply) => {
    try {
      const res = await fetch("/api/comments/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          isReply,
          id: user.id,
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
