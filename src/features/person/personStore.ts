import { Movie } from "../movie/movieStore";
import { create } from "zustand";

export type Person = {
  personContent: any;
  person: any;
  name: string | null;
  id: number | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: number | null;
  place_of_birth: string | null;
  known_for_department: string | null;
  profile_path: string | null;
  homepage: string | null;
};

export type PersonState = {
  person: Person | null;
  movies: Movie[];
  tvShows: Movie[];
  error: any;
  fetchPerson: (id: string) => Promise<void>;
};

export const usePersonStore = create<PersonState>((set, get) => ({
  person: null,
  movies: [],
  tvShows: [],
  error: null,

  fetchPerson: async (id: string) => {
    set({ error: null }); // Clear previous errors
    console.log(id);
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
      console.log(data);

      set({
        person: data || null,
        error: null,
      });
    } catch (error: any) {
      console.log("Error fetching person:", error);
      set({ error: error.message || "Unexpected error" });
    }
  },
}));
