import api from "../lib/api";

export const registerUser = (
  full_name: string,
  email: string,
  password: string
) => {
  return api.post("/register", {
    full_name,
    email,
    password,
  });
};

export const loginUser = (
  email: string,
  password: string
) => {
  return api.post("/login", {
    email,
    password,
  });
};

export const forgotPassword = (email: string) => api.post("/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  api.post("/reset-password", { token, password });
