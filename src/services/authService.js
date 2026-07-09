import { apiClient } from "./apiClient";

export const apiAuth = {
  signIn: (credentials) => apiClient.post("/auths/sign_in", credentials),
  signUp: (credentials) => apiClient.post("/auths/sign_up", credentials),
  signOut: (credentials) =>
    apiClient.post(`/auths/sign_out?is_all=${true}`, credentials, true),
};
