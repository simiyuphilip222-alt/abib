import { jwtDecode } from "jwt-decode";

/* =========================
   GET AUTH USER FROM TOKEN
========================= */
export const getAuthUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};

/* =========================
   CHECK IF USER IS ADMIN
========================= */
export const isAdmin = () => {
  const user = getAuthUser();
  return user?.role === "admin";
};

/* =========================
   CHECK IF USER IS LOGGED IN
========================= */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* =========================
   LOGOUT SYSTEM (SAFE + REACTIVE)
========================= */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("authUser");

  // Notify entire app (reactive logout)
  window.dispatchEvent(new Event("authChange"));
};
