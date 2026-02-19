import { computed, useState } from "#imports";
const useUser = () => useState("user", () => null);
export const useAuth = () => {
  const user = useUser();
  const loggedIn = computed(() => user.value !== null);
  const fetchUser = async () => {
    try {
      const data = await $fetch("/api/staff/auth/me");
      user.value = data.user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      user.value = null;
    }
  };
  const login = async (credentials) => {
    try {
      await $fetch("/api/staff/auth/login", {
        method: "POST",
        body: credentials
      });
      await fetchUser();
      return { success: true };
    } catch (error) {
      const authError = error;
      const message = authError.data?.message ?? "Login failed";
      return { success: false, message };
    }
  };
  const logout = async () => {
    try {
      await $fetch("/api/staff/auth/logout", { method: "POST" });
      user.value = null;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return {
    user,
    loggedIn,
    fetchUser,
    login,
    logout
  };
};
