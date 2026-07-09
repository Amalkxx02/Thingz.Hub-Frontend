import { apiClient } from "./apiClient";

export const apiAuth = {
  get_user: () => apiClient.get("/users"),
};