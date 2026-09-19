import { create } from "zustand";
import { Comment } from "@/types/comment";
import { User } from "../collection/collectionStore";

type Media = {
  backdrops: {
    file_path: string;
  };
};

export type Movie = {
  media_type: string;
  mediaType: string;
  type: string;
  first_air_date: string;
  id: number;
  title: string;
  name: string;
  backdrop_path: string;
  poster_path: string;
  posterPath: string;
  poster: string;
  adult: boolean | null;
  media: Media;
  overview: string;
  release_date: string;
  releaseDate: string;
  original_language: string;
  video: boolean;
  rating: number;
  trailerKey: string;
  genre_ids: number[];
};

export type Rating = {
  rating: number;
  votes: number;
};

interface SearchResult {
  id?: number;
  media_type?: string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  total_pages?: number;
  total_results?: number;
}

export type MovieState = {
  id?: number | string | null;
  results: Movie[];
  loading: boolean;
  movies: Movie[];
  movie: Movie | null;
  videos: [];
  input: string | null;
  error: string | null;
  total_pages: number;
  total_results: number;

  trending: (
    mediaType: string,
    input: number,
    options?: { signal?: AbortSignal },
  ) => Promise<Movie[]>;
  trendingVideos: (
    mediaType: string,
    input: number,
    options?: { signal?: AbortSignal },
  ) => Promise<Movie[]>;
  similar: (id: string, type: string) => Promise<any[]>;
  search: (input: string, page: number) => Promise<SearchResult[]>;
  optionFetch: (filter: []) => Promise<MovieState[]>;
  genre: (filter: []) => Promise<MovieState[]>;
  comments: Comment[];
  fetchComments: (movieId: number, mediaType: string) => Promise<void>;
  addComment: (
    user: {
      id: string | undefined;
      username: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    },
    movieId: number,
    commentText: string,
    rating: number,
    type: string,
    spoiler: boolean,
  ) => Promise<void>;
  addRespond: (
    user: User,
    commentId: string | undefined,
    respond: string,
  ) => Promise<void>;
};

export const useMovieStore = create<MovieState>((set) => ({
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

  trending: async (
    mediaType: string,
    page: number,
    options?: { signal?: AbortSignal },
  ) => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  trendingVideos: async (
    mediaType: string,
    page: number,
    options?: { signal?: AbortSignal },
  ) => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  search: async (input: string, page: number): Promise<SearchResult[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  optionFetch: async (filter: any): Promise<MovieState[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  genre: async (filter): Promise<MovieState[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  fetchInfo: async (id: string, type: string): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  getCategory: async (mediaType: string, id: string): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },
  similar: async (id: string, type: string): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },
  fetchComments: async (movieId: number, mediaType: string) => {
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

  addComment: async (
    user: {
      id: string | undefined;
      username: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    },
    movieId: number,
    commentText: string,
    rating: number,
    type: string,
    spoiler: boolean,
  ) => {
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

  addRespond: async (
    user: User,
    commentId: string | undefined,
    respond: string,
  ) => {
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

  addLike: async (
    user: {
      id: string | undefined;
      username: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    },
    commentId: string | undefined,
    isReply: boolean,
  ) => {
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
            // Top-level comment like
            return {
              ...c,
              likes: data.comment.likes,
            };
          }

          if (isReply) {
            // Reply like — find and update the matching reply
            return {
              ...c,
              replies: c.replies.map((r) =>
                r?.id === data?.reply?.id
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
