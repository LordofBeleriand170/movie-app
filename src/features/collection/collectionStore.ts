import { create } from "zustand";

interface CollectionState {
  user: any | null;
  likes: any[];
  favorite: any[];
  watchlist: any[];
  watched: boolean;
  ratings: any[];
  notifications: any[];
  banReason: string | null;
  bannedUntil: string | null;
  recently: any[];
  comments: any[];
  loading: boolean;
  countries: any[];
  fetchUserCollections: (email: any) => Promise<void>;
  addFavorite: (id: string, result: any, media: string) => Promise<void>;
  addWatchlist: (id: string, result: any) => Promise<void>;
  addRating: (
    id: string,
    result: any,
    media: string,
    rating?: number,
  ) => Promise<void>;
  getCountries: () => Promise<void>;
  report: (id: string, user: any) => Promise<void>;
  ban: (
    receiverId: string,
    senderId: string,
    bannedText: string | null,
    bannedUntil: string | null,
  ) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  clearRecentlyVisited: (user: any) => Promise<void>;
  clearNotifications: (userId: any) => Promise<void>;
  isWatchedBatch: (
    userId: string,
    contentIds: (string | number)[],
  ) => Promise<boolean>;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  user: null,
  watched: false,
  likes: [],
  favorite: [],
  watchlist: [],
  ratings: [],
  notifications: [],
  banReason: null,
  bannedUntil: null,
  recently: [],
  comments: [],
  loading: true,
  countries: [],

  fetchUserCollections: async (email) => {
    if (!email) return;

    try {
      const res = await fetch(`/api/user/collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to fetch collections");

      const data = await res.json();

      set({
        user: data.user,
        likes: [], // moze se kasnije mapirati ako implementiras upvotes/downvotes
        favorite: data.user.favorite || [],
        watchlist: data.user.watchlist || [],
        ratings: data.user.ratings || [],
        recently: data.user.recently || [],
        notifications: data.user.notifications || [],
        comments: data.user.comments || [],
        banReason: data.user.banReason || null,
        bannedUntil: data.user.bannedUntil || null,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user collections:", error);
    }
  },

  addFavorite: async (id, result, media) => {
    try {
      const res = await fetch(`/api/collections/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, result, media }),
      });

      const data = await res.json();

      set({
        favorite: data.user?.favorite || [],
        loading: false,
      });
    } catch (err) {
      console.error(`Failed to add favorite:`, err);
    }
  },

  addWatchlist: async (id, result) => {
    try {
      const res = await fetch(`/api/collections/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, result }),
      });

      const data = await res.json();

      set({
        watchlist: data?.user?.watchlist || [],
        loading: false,
      });
    } catch (err) {
      console.error(`Failed to add watchlist:`, err);
    }
  },

  addRating: async (id, result, media, rating) => {
    try {
      const res = await fetch(`/api/collections/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, result, media, rating }),
      });

      const data = await res.json();

      set({
        ratings: data.user?.ratings || [],
        loading: false,
      });
    } catch (err) {
      console.error(`Failed to add rating:`, err);
    }
  },

  getCountries: async () => {
    try {
      const res = await fetch(`/api/countries`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      set({
        countries: data.countries || [],
      });

      return data;
    } catch (err) {
      console.error(`Failed to fetch countries:`, err);
    }
  },

  report: async (id: string, user: any) => {
    try {
      const res = await fetch(`/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle report:`, err);
    }
  },

  ban: async (
    receiverId: string,
    senderId: string,
    bannedText: string | null,
    bannedUntil: string | null,
  ) => {
    try {
      const res = await fetch(`/api/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, senderId, bannedText, bannedUntil }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle ban:`, err);
    }
  },

  deleteComment: async (id: string) => {
    try {
      const res = await fetch(`/api/deleteComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle ban:`, err);
    }
  },

  clearRecentlyVisited: async (user: any) => {
    try {
      const res = await fetch(`/api/clearRecentlyVisited`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      set({ recently: [] });

      return data;
    } catch (err) {
      console.error(`Failed to clear recently visited:`, err);
    }
  },

  clearNotifications: async (userId: string) => {
    try {
      const res = await fetch(`/api/clearNotifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to clear recently visited:`, err);
    }
  },

  // Inside collectionStore.ts
  isWatchedBatch: async (userId: string, contentIds: (string | number)[]) => {
    if (!userId || !contentIds.length) return {};

    try {
      const idsParam = contentIds.join(",");
      const res = await fetch(
        `/api/watched?userId=${userId}&contentIds=${idsParam}`,
      );
      if (!res.ok) return {};

      const data = await res.json();
      return data.watchedStatuses || {}; // Returns { "550": true, "680": false }
    } catch (err) {
      console.error("isWatchedBatch error:", err);
      return {};
    }
  },
}));
