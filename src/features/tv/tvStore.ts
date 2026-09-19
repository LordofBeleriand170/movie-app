import { create } from "zustand";

// Types
export type Episode = {
  id: number;
  name: string | null;
  episode_number: number | null;
  poster_path: string;
  still_path: string | null;
  overview: string;
  air_date: string | null;
  runtime: number | null;
};

export type TvShow = {
  id: number;
  title: string;
  name: string;
  backdrop_path: string;
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  original_language: string;
  video: boolean;
  genre_ids: number[];
  seasons: Season | null; // Add seasons to the TvShow type
};

export type Season = {
  id: number;
  name: string | null;
  season_number: number;
  overview: string;
  episode_count: number;
  episodes: Episode | null; // Array of Episode objects (not a single Episode)
};

export type TvShowState = {
  tvShows: TvShow[]; // To store multiple TV shows (trending, search, etc.)
  tvShow: TvShow | null; // Optional: single selected TV show
  season: Season | null; // Selected season details
  episodes: Episode | null; // Selected episode details
  error: string | null;

  fetchSeason: (id: string, season: number | null) => Promise<Season[] | []>; // Fetch season by id
  fetchEpisodes: (
    tvId: number,
    seasonNumber: number,
  ) => Promise<Episode | null>;
  /*tvShowRecommended: (id: string) => Promise<TvShow[] | []>;*/
};

export const useTvShowStore = create<TvShowState>((set) => ({
  tvShows: [],
  tvShow: null,
  season: null,
  episodes: null,
  error: null,

  // Fetch seasons and episodes for a specific TV show
  // Fetch season data
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
          episodes: data.episodes, // should be an array of episodes
        },
        error: null,
      });

      return data || null;
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch season data" });
      return null;
    }
  },

  // Fetch episodes for a specific season of a TV show
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
          episodes: data.episodes, // This should be an array of episodes
        },
        error: null,
      });

      return data.episodes || [];
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch episode data" });
      return []; // Return empty array on error
    }
  },
  /*tvShowRecommended: async (id: string) => {
    set({ error: null });
    try {
      const response = await axios.post(
        `http://localhost:5000/api/movie/recommendations`,
        {
          id,
        }
      );

      console.log(response);

      set({
        tvShows: response?.data || response || [],
        error: null,
      });

      // Return the array of movies as expected by the return type
      return response?.data || response || [];
    } catch (error: any) {
      set({ error: error });
      return []; // Return an empty array in case of an error
    }
  },*/
}));
