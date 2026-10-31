import { create } from "zustand";

export const useLogsStore = create((set) => ({
  logs: [],
  loading: null,
  error: null,

  fetchLogs: async () => {
    set({ logs: [], loading: true, error: false });

    try {
      const res = await fetch("/api/logs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching logs items");
      }

      const data = await res.json();

      set({
        logs: data.logs,
        loading: false,
        error: false,
      });

      return data.results || [];
    } catch (err) {
      if (err.name === "AbortError") return [];

      console.error("Failed to fetch trending:", err);
      set({ error: err?.message || "Unknown error", loading: false });
      return [];
    }
  },
}));
