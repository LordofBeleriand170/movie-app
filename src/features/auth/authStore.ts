import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/components/InfoComponent";
import { Comment } from "@/types/comment";

export type AuthState = {
  user: {
    id: string;
    username: string | null;
    email: string | null;
    isVerified: boolean;
    favorite: Movie[];
    watchlist: Movie[];
    likes: Comment[];
    ratings: any[];
    reviews: any[];
    notifications: any[];
  } | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  verifyEmail: (verificationCode: string) => Promise<any>;
  getUser: (username: string) => Promise<any>;
  setUser: (user: AuthState["user"]) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: false,

      verifyEmail: async (verificationCode: string) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationCode }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error verifying email");
          }

          const data = await res.json();

          // Prisma API: map relacije
          set({
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              isVerified: data.user.isVerified,
              favorite: data.user.favorite || [],
              watchlist: data.user.watchlist || [],
              likes: data.user.upvotedComments || [],
              ratings: data.user.ratings || [],
              reviews: data.user.comments || [],
              notifications: data.user.notifications || [],
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error: any) {
          set({
            error: error.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      getUser: async (username: string) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/getUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error verifying email");
          }

          const data = await res.json();

          return data.user;
        } catch (error: any) {
          set({
            error: error.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
