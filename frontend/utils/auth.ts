import axios from "axios";

export const fetchAuthProviders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/auth/providers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      console.warn("Providers data is null, returning empty object");
      return {};
    }
  } catch (error) {
    console.error("Error fetching auth providers: ", error);
    return {};
  }
};

export const fetchAuthSession = async () => {
  try {
    const response = await axios.get("/api/auth/session");
    if (response.data && response.data.session) {
      return response.data.session;
    } else {
      console.warn("Session data is null, returning empty object");
      return {};
    }
  } catch (error) {
    console.error("Error fetching auth session: ", error);
    return {};
  }
};

export const fetchAuthError = async (error: string) => {
  try {
    const response = await axios.get("/api/auth/error", {
      params: { error },
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const authLog = async (message: string) => {
  try {
    const response = await axios.post("/api/auth/_log", { message });
    return response.data;
  } catch (error) {
    console.error("Error sending log: ", error);
    throw error;
  }
};
