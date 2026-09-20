import { create } from "zustand";

export const useCollectionStore = create((set) => ({
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

  report: async (id, user) => {
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

  ban: async (receiverId, senderId, bannedText, bannedUntil) => {
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

  deleteComment: async (id) => {
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

  clearRecentlyVisited: async (user) => {
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

  clearNotifications: async (userId) => {
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

  isWatchedBatch: async (userId, contentIds) => {
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
