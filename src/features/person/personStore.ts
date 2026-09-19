import { Movie } from "../movie/movieStore";
import { create } from "zustand";

type PersonContent = {
  weight: number;
};

export type Person = {
  name: string | null;
  title: string | null;
  id: number;
  mediaId: number;
  contentId: number;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: number | null;
  place_of_birth: string | null;
  known_for_department: string | null;
  profile_path: string | null;
  homepage: string | null;

  personContent: PersonContent;
};

export type PersonState = {
  person: Person | null;
  movies: Movie[];
  tvShows: Movie[];
  error: Error | null;
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
        person: data?.person || null,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching movie info:", err);
    }
  },
}));
