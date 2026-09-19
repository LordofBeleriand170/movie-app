import { create } from "zustand";
import { Comment } from "@/types/comment";
import Sentiment from "sentiment";
import { User } from "../collection/collectionStore";
const sentimentAnalyzer = new Sentiment();

export interface Backdrops {
  file_path: string | null;
  vote_count: number;
}

export type ReplyLike = {
  id?: string;
  replyId?: string;
  userId?: string;
  like?: {
    userId: string;
  };
};

export type Recent = {
  id: string;
  title: string;
  name: string;
};

export type Watchlist = {
  id: string;
  userId: string;
  mediaId: number;
  title: string;
  name: string;
  poster: string;
  mediaType: string;
  releaseDate: string;
  user: User;
};

export type Favorite = {
  id: string;
  userId: string;
  mediaId: number;
  title: string;
  name: string;
  poster: string;
  mediaType: string;
  releaseDate: string;
  user: User;
};

export type Reply = {
  id: string;
  text: string;
  userId: string;
  username?: string;
  image?: string | null;
  createdAt: string | Date;
  commentId?: string;
  replyLikes?: ReplyLike[];
  user?: {
    id: string;
    username?: string;
    image?: string | null;
    role?: "USER" | "ADMIN";
    bannedUntil?: string | Date | null;
  };
};

export type AiSummary = {
  text?: string;
  summaryText?: string;
  summaryParagraph?: string;
  summary?: string;
  pros?: string[];
  tags?: string[];
  cons?: string[];
};

export interface Cast {
  cast_id: number;
  character: string | null;
  credit_id: number;
  department: string | null;
  gender: number | null;
  id: number;
  name: string | null;
  profile_path: string | null;
}

export interface Crew {
  gender: number | null;
  id: number;
  job: string | null;
  department: string | null;
  known_for_department: string | null;
  name: string | null;
  profile_path: string | null;
  popularity: number;
}

export interface Creator {
  credit_id: string;
  gender: number | null;
  id: number | null;
  name: string;
  original_name: string | null;
  profile_path: string;
}

export interface InfoComponentProps {
  option: string | null;
  type: string;
}

export interface Logos {
  file_path: string | null;
  vote_count: number;
}

export interface Networks {
  id: number | null;
  logo_path: string | null;
  name: string | null;
}

export interface Posters {
  title: string | null;
  name: string | null;
  poster_path: string | null;
  file_path: string | null;
  vote_count: number;
}

export interface Season {
  air_date: string | null;
  episode_count: number;
  episodes: Episode[] | null;
  id: number;
  name: string | null;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface TvShow {
  adult: boolean;
  backdrop_path: string;
  created_by?: Creator[];
  first_air_date: string | null;
  genre_ids?: number[];
  genres?: Genre[];
  id: number;
  last_air_date?: string | null;
  name: string;
  networks?: Networks[] | null;
  next_episode_to_air?: Episode | null;
  number_of_episodes?: number | null;
  number_of_seasons?: number;
  overview: string;
  poster_path: string;
  rating: number;
  release_date: string;
  seasons: Season[] | null;
  status?: string;
  title?: string;
  original_language: string;
  video: boolean;
}

export interface Movie {
  runtime: number;
  mediaId: number;
  contentId: number;
  adult: boolean | null;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  genres: Genre[];
  id: number;
  name: string;
  overview: string;
  original_language: string;
  poster_path: string;
  rating: number;
  release_date: string;
  title: string;
  trailerKey?: string;
  media_type: string;
  video: boolean;
}

export interface SearchResult {
  first_air_date?: string;
  id?: number;
  media_type?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  title?: string;
  total_pages?: number;
  total_results?: number;
}

export type CastMember = {
  id: number | string;
  name: string;
  character?: string;
  profile_path?: string | null;
  gender: number | null;
  roles: {
    character: string;
  }[];
  total_episode_count: number | null;
};

export type Content = {
  id: string;
  info: { id: string };
  credits: {
    cast: CastMember[];
  };
};

export interface Genre {
  id: number;
  name: string;
}

export interface Episode {
  air_date: string | null;
  episode_number: number | null;
  id: number;
  name: string | null;
  overview: string;
  poster_path: string;
  runtime: number | null;
  still_path: string | null;
}

export type ContentState = {
  addComment: (
    user: User | null,
    movieId: number,
    commentText: string,
    rating: number,
    type: string,
    spoiler: boolean,
  ) => Promise<void>;

  category: Movie[] | TvShow[];
  comments: Comment[];
  ratings: Rating[];
  aiSummary: AiSummary | null;
  aiLoading: boolean;
  aiError: string | null;
  sentimentScore: number;
  episodes: Episode[] | null;
  rating: Rating[] | null;
  content: Content | null;
  error: string | null;
  fetchComments: (movieId: number, mediaType: string) => Promise<void>;
  fetchRating: (movieId: number, mediaType: string) => Promise<void>;

  fetchEpisodes: (
    tvId: number,
    seasonNumber: number,
  ) => Promise<Episode[] | null>;
  fetchInfo: (id: string, type: string, user: User) => Promise<any>;
  fetchSeason: (id: string, season: number | null) => Promise<Season[] | []>;
  input: string | null;
  loading: boolean;
  movie: Movie | null;
  movies: Movie[];
  optionFetch: (filter: []) => Promise<ContentState[]>;
  similar: (id: string, type: string, info: []) => Promise<any[]>;
  results: Movie[];
  season: Season | null;
  total_pages: number;
  total_results: number;
  tvShow: TvShow | null;
  tvShows: TvShow[];
  getCommentInfo: (commentId: string) => Promise<any[]>;
  fetchAiSummary: (movieId: number, mediaType: string) => Promise<any>;
  recommendations: (watchlist: Watchlist, favorite: Favorite) => Promise<any[]>;
};

export interface Voter {
  userId: string;
  rating: number;
}

export type Rating = {
  movieId: string;
  mediaType: string;
  rating: number;
  votes: number;
  voters: Voter[] | null;
};

export interface Videos {
  file_path: string | null;
  vote_count: number;
}

export interface Networks {
  name: string | null;
  logo_path: string | null;
  id: number | null;
}

export const useContentStore = create<ContentState>((set, get) => ({
  results: [],
  movies: [],
  tvShows: [],
  category: [],
  content: null,
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

  addComment: async (
    user: User | null,
    movieId: number,
    commentText: string,
    rating: number,
    type: string,
    spoiler: boolean,
  ) => {
    if (!user) {
      set({ error: "You must be logged in to post a comment." });
      return;
    }

    set({ error: null });
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
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

  addLike: async (
    user: User,
    commentId: string | undefined,
    isReply: boolean,
    mediaId: string,
  ) => {
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

  addRespond: async (
    user: {
      id: string | undefined;
      username: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
    },
    commentId: string | undefined,
    respond: string,
    rating: number,
  ) => {
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

  fetchComments: async (movieId: number, mediaType: string) => {
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
      fetchedComments.forEach((c: any) => {
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

  fetchRating: async (movieId: number, mediaType: string) => {
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

  fetchEpisodes: async (tvId: number, seasonNumber: number) => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  fetchInfo: async (id: string, type: string, user: User): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  fetchSeason: async (id: string, season: number | null) => {
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

  optionFetch: async (filter: []): Promise<ContentState[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  similar: async (id: string, type: string, info: any): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  getCommentInfo: async (commentId: string): Promise<any[]> => {
    set({ content: null, loading: true, error: null });

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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  fetchAiSummary: async (
    movieId: number,
    mediaType: string,
    contentTitle?: string,
  ) => {
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

  recommendations: async (
    watchlist: Watchlist[],
    favorite: Favorite[],
  ): Promise<any[]> => {
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      set({ error: message });
      return [];
    }
  },

  // Fetch episodes for a specific season of a TV show
}));
