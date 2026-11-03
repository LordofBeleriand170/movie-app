import { create } from "zustand";

export const useContentStore = create((set, get) => ({
  results: [],
  movies: [],
  season: null,
  category: [],
  content: [],
  season: null,
  episodes: null,
  movie: null,
  loading: null,
  total_pages: 0,
  total_results: 0,
  input: null,
  error: null,
  ratings: [],
  rating: [],
  notifications: [],
  casts: [],
  crew: [],
  avg: null,
  voters: null,
  director: [],
  writer: [],
  creator: [],
  video: [],
  cast: [],
  loadingSeasonInfo: null,

  

  fetchRating: async (movieId, mediaType) => {
    set({ ratings: [] });
    mediaType = mediaType === "movies" ? "movie" : "tv";
    try {
      const res = await fetch(`/api/collections/getRatings`, {
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

  fetchInfo: async (id, type, user) => {
    set({
      error: null,
      loading: true,
      avg: 0,
      voters: 0,
      director: [],
      writer: [],
      creator: [],
      video: [],
      cast: [],
    });
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

      const currentSeason =
        data?.info?.seasons?.find(
          (season) =>
            season?.name === "Season 1" || season?.season_number === 1,
        ) || null;

      set({
        season: currentSeason || [],
        loading: false,
        content: data?.info || [],
        director: data?.director || [],
        writer: data?.writer || [],
        creator: data?.creator || [],
        cast: data?.credits?.cast || [],
        crew: data?.credits?.crew || [],
        avg:
          data?.ratingAvg?._avg?.rating !== false
            ? data?.ratingAvg?._avg?.rating
            : data?.info?.vote_average,
        voters:
          data?.ratingAvg?._count?.rating !== 0
            ? data?.ratingAvg?._count?.rating
            : data?.info?.vote_count,
        video: data?.video || [],
        error: null,
      });
    } catch (error) {
      set({ error: error.message || "Unexpected error", loading: false });
      throw error;
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
  deleteNotifications: async (id) => {
    set({ error: null });
    try {
      const res = await fetch("/api/notifications/deleteNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = res.json();

      set({
        error: false,
        notifications: state.notifications.filter((not) => not.id !== id),
      });

      return data;
    } catch (error) {
      set({ error: error.message || "Unexpected error", loading: false });
      return [];
    }
  },
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
  fetchSeason: async (id, currentSeason) => {
    set({ error: null, season: null, loadingSeasonInfo: true });

    try {
      const res = await fetch(`/api/tv/fetchSeason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, season: currentSeason }),
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
          poster_path: data.poster_path,
        },
        error: null,
        episodes: data.episodes,
        loadingSeasonInfo: false,
      });

      return data || null;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch season data",
        loadingSeasonInfo: false,
      });
      return null;
    }
  },
}));
