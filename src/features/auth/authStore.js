import { signIn } from "next-auth/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: false,

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            const errorMsg = data.error || "Registration failed";
            set({ error: errorMsg, isLoading: false });
            return { ok: false, error: errorMsg };
          }

          set({ isLoading: false });
          return { ok: true, data };
        } catch (error) {
          const errorMsg =
            error.message || "Error occurred during registration";
          set({
            error: errorMsg,
            isLoading: false,
          });
          return { ok: false, error: errorMsg };
        }
      },

      login: async (username, password, callbackUrl) => {
        set({ error: null, user: null, isAuthenticated: false });

        const res = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        try {
          if (res?.ok) {
            const sessionRes = await fetch("/api/auth/session");
            const updatedSession = await sessionRes.json();

            set({
              error: null,
              user: updatedSession?.user,
              isAuthenticated: true,
            });

            return { success: true };
          } else {
            set({
              error: res?.error || "Login failed",
              isAuthenticated: false,
            });

            throw new Error(res?.error || "Login failed");
          }
        } catch (err) {
          set({
            error: res?.error || err.message || "Login failed",
            isAuthenticated: false,
          });

          throw err;
        }
      },

      logout: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error logging out");
          }

          const data = await res.json();

          set({
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error) {
          set({
            error: error.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      verifyEmail: async (verificationCode) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationCode }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error verifying email");
          }

          const data = await res.json();

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
        } catch (error) {
          set({
            error: error.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      resendVerificationCode: async (username) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/auth/resendVerificationCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || "Error resending verification code",
            );
          }

          const data = await res.json();

          return data;
        } catch (error) {
          set({
            error: error.message || "Error resending verification code",
            isLoading: false,
          });
          throw error;
        }
      },

      forgotPassword: async (identifier) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/auth/forgotPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || "Error sending request for password reset",
            );
          }

          const data = await res.json();

          return data;
        } catch (error) {
          set({
            error: error.message || "Error sending request for password reset",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (identifier, password) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const res = await fetch("/api/auth/resetPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error resetting password");
          }

          const data = await res.json();

          return data;
        } catch (error) {
          set({
            error: error.message || "Error resetting password",
            isLoading: false,
          });
          throw error;
        }
      },

      getUser: async (id) => {
        set({
          isLoading: true,
          error: null,
          user: null,
        });

        try {
          const res = await fetch("/api/user/getUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error verifying email");
          }

          const data = await res.json();
          set({
            user: {
              ...data.user,
              role: data.user.role,
            },
            isLoading: false,
          });

          return data.user;
        } catch (error) {
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
