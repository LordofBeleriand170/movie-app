import { create } from "zustand";

export const useTvShowStore = create((set) => ({
  tvShows: [],
  tvShow: null,
  season: null,
  episodes: null,
  error: null,

  // Fetch season data
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
        },
        error: null,
      });

      return data || null;
    } catch (error) {
      set({ error: error.message || "Failed to fetch season data" });
      return null;
    }
  },

  // Fetch episodes for a specific season of a TV show
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
        },
        error: null,
      });

      return data.episodes || [];
    } catch (error) {
      set({ error: error.message || "Failed to fetch episode data" });
      return [];
    }
  },
}));
