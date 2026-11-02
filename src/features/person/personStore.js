import { create } from "zustand";

export const usePersonStore = create((set, get) => ({
  person: null,
  movies: [],
  tvShows: [],
  error: null,
  loading: null,

  fetchPerson: async (id) => {
    set({ error: null, loading: true });
    try {
      const res = await fetch("/api/fetchPerson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch person data");
      }

      const data = await res.json();

      set({
        person: data || null,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.log("Error fetching person:", error);
      set({ error: error.message || "Unexpected error", loading: false });
    }
  },
}));
