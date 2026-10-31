import { create } from "zustand";

export const useCollectionStore = create((set, get) => ({
  user: null,
  watched: false,
  likes: [],
  favorite: [],
  watchlist: [],
  bookmark: [],
  ratings: [],
  list: null,
  lists: [],
  notifications: [],
  banReason: null,
  bannedUntil: null,
  recently: [],
  comments: [],
  loading: false,
  countries: [],

  fetchUserCollections: async (email) => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/user/collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        set({ error: "Failed to fetch collections", loading: false });
        throw new Error("Failed to fetch collections");
      }

      const data = await res.json();
      console.log("DATA USdsadasdasdasER: ", data?.user);

      set({
        user: data.user,
        likes: [],
        favorite: data.user.favorite || [],
        watchlist: data.user.watchlist || [],
        bookmark: data.user.bookmark || [],
        ratings: data.user.ratings || [],
        recently: data.user.recently || [],
        notifications: data.user.notifications || [],
        comments: data.user.comments || [],
        banReason: data.user.banReason || null,
        bannedUntil: data.user.bannedUntil || null,
        image: data.user.image || null,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user collections:", error);
      set({ loading: false }); // Ensure loading is cleared on error so it doesn't stay stuck
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

  addBookmark: async (id, result) => {
    try {
      const res = await fetch(`/api/collections/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, result }),
      });

      const data = await res.json();

      set({
        bookmark: data?.user?.bookmark || [],
        loading: false,
      });
    } catch (err) {
      console.error(`Failed to add bookmark:`, err);
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

  getLists: async () => {
    set({ lists: [] });
    try {
      const res = await fetch(`/api/list`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      set({ lists: data?.lists });

      return data;
    } catch (err) {
      set({ error: err });
      console.error(`Failed to handle report:`, err);
    }
  },

  createList: async (userId, text, description) => {
    try {
      const res = await fetch(`/api/list/createList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text, description }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle report:`, err);
    }
  },

  addToList: async (content, listId) => {
    try {
      const res = await fetch(`/api/list/addToList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, listId }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to handle report:`, err);
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

  deleteComment: async (id, isComment) => {
    try {
      const res = await fetch(`/api/deleteComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isComment }),
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
      console.error(`Failed to clear notifications:`, err);
    }
  },

  isWatchedBatch: async (userId, contentIds) => {
    if (!userId || !contentIds?.length) return {};

    console.log("CONTENTIDS: ", contentIds);

    try {
      const idsParam = contentIds
        .map((item) => (typeof item === "object" ? item?.key : item))
        .filter(Boolean)
        .join(",");

      if (!idsParam) return {};

      const res = await fetch(
        `/api/watched?userId=${userId}&contentIds=${encodeURIComponent(idsParam)}`,
      );
      if (!res.ok) return {};

      const data = await res.json();
      return data.watchedStatuses || {};
    } catch (err) {
      console.error("isWatchedBatch error:", err);
      return {};
    }
  },

  updateUser: async (userData) => {
    try {
      const res = await fetch(`/api/user/updateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });

      const data = await res.json();

      set({ user: data?.user });

      return data;
    } catch (err) {
      console.error(`Failed to update user:`, err);
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await fetch(`/api/user/deleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(`Failed to delete user:`, err);
    }
  },
}));
