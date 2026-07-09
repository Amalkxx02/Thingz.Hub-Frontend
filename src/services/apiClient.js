// const baseUrl = "http://127.0.0.1:8000/api/v1";
const baseUrl = "http://192.168.1.54:8000/api/v1";


const ironFetch = async (endpoint, customConfig = {}, useRefresh=false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  if (access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
  }
  if (useRefresh && refresh_token) {
    headers["Authorization"] = `Bearer ${refresh_token}`;
  }

  const config = {
    ...customConfig,
    headers: { ...headers, ...customConfig.headers },
  };

  // If the request has a JSON body, turn the JS Object into a string
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth"; // <--- This was forcing the full page reload!
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();
  console.log(data)

  if (!response.ok) {
    throw new Error(
      data.message || `Server rejected with status: ${response.status}`,
    );
  }

  return data;
};

export const apiClient = {
  get: (endpoint, useRefresh = false) => ironFetch(endpoint, { method: "GET" }, useRefresh),
  post: (endpoint, body, useRefresh = false) => ironFetch(endpoint, { method: "POST", body }, useRefresh),
  put: (endpoint, body) => ironFetch(endpoint, { method: "PUT", body }),
  delete: (endpoint) => ironFetch(endpoint, { method: "DELETE" }),
};