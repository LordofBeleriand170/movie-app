import { create } from "zustand";

export const useAdminStore = create((set) => ({
  users: [],
  loading: null,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: false, users: [] });
    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to get users");

      const data = await res.json();

      console.log("DATA ADMIN USERS: ", data);

      set({ users: data?.users, loading: false, error: false });
    } catch (err) {
      set({ error: err || "Error occured" });
    }
  },
}));
