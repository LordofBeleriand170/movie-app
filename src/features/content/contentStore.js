import { create } from "zustand";
import Sentiment from "sentiment";
const sentimentAnalyzer = new Sentiment();

export const useContentStore = create((set, get) => ({
  results: [],
  movies: [],
  tvShows: [],
  category: [],
  content: [],
  tvShow: null,
  season: null,
  episodes: null,
  movie: null,
  loading: true,
  total_pages: 0,
  total_results: 0,
  input: null,
  error: null,
  comments: [],
  ratings: [],
  aiSummary: null,
  aiLoading: false,
  aiError: null,
  sentimentScore: 0,
  rating: [],

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
      console.log(data);

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

  addLike: async (user, commentId, isReply, mediaId) => {
    try {
      const res = await fetch("/api/comments/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          isReply,
          username: user.username,
          mediaId,
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
          data.comment.replies[data.comment.replies.length - 1];

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
      set({ comments: [], aiLoading: false, aiSummary: null });
    }
  },

  fetchRating: async (movieId, mediaType) => {
    set({ ratings: [] });
    mediaType = mediaType === "movies" ? "movie" : "tv";
    try {
      const res = await fetch(`/api/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, mediaType }),
      });
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();

      const fetchedRatings = data.contentRating || [];

      set({
        ratings: fetchedRatings,
      });
    } catch (err) {
      console.error("Fetch comments error:", err);
      set({ ratings: [], aiLoading: false, aiSummary: null });
    }
  },

  fetchEpisodes: async (tvId, seasonNumber) => {
    set({ error: null });

    let type = "tv";

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${tvId}/season/${seasonNumber}/episodes?api_key=YOUR_API_KEY`,
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.status_message || "Failed to fetch episode data",
        );
      }

      const data = await res.json();

      set({
        season: {
          id: data.id,
          name: data.name,
          overview: data.overview,
          season_number: data.season_number,
          episode_count: data.episode_count,
          episodes: data.episodes,
          air_date: null,
          poster_path: null,
        },
        error: null,
      });

      return data.episodes || [];
    } catch (error) {
      set({ error: error.message || "Failed to fetch episode data" });
      return [];
    }
  },

  fetchInfo: async (id, type, user) => {
    set({ error: null });

    try {
      const res = await fetch(`/api/${type}/getInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type, user }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching movie info");
      }

      const data = await res.json();

      set({
        content: data?.results || data || [],
        error: null,
      });

      return data?.results || data || [];
    } catch (error) {
      set({ error: error.message || "Unexpected error" });
      throw error;
    }
  },

  fetchSeason: async (id, season) => {
    set({ error: null });

    let type = "tv";

    try {
      const res = await fetch(`/api/${type}/fetchSeason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, season }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch season data");
      }

      const data = await res.json();

      set({
        season: {
          id: data.id,
          name: data.name,
          overview: data.overview,
          season_number: data.season_number,
          episode_count: data.episode_count,
          episodes: data.episodes,
          air_date: null,
          poster_path: null,
        },
        error: null,
      });

      return data || null;
    } catch (error) {
      set({ error: error.message || "Failed to fetch season data" });
      return null;
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
        movies: data?.result?.results || [],
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

  similar: async (id, type, info) => {
    set({ movies: [], error: null });

    try {
      type = type === "movies" ? "movie" : "tv";

      const res = await fetch(`/api/${type}/similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type, info }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching similars");
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

  getCommentInfo: async (commentId) => {
    set({ content: [], loading: true, error: null });

    try {
      const res = await fetch(`/api/getComment`, {
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

  recommendations: async (watchlist, favorite) => {
    set({ movies: [], error: null, loading: true });

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          watchlist,
          favorite,
        }),
      });

      const data = res.json();

      return data;
    } catch (error) {
      set({ error: error.message || "Unexpected error", loading: false });
      return [];
    }
  },
}));
