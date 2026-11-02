import { create } from "zustand";

export const useAdminStore = create((set) => ({
  users: [],
  loading: null,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: false, users: [] });
    try {
      const res = await fetch("/api/admin/fetchUsers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to get users");

      const data = await res.json();

      set({ users: data?.users, loading: false, error: false });
    } catch (err) {
      set({ error: err || "Error occured" });
    }
  },
}));
