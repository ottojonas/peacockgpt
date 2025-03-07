import axios from "axios";
import { error } from "console";

export const fetchAuthProviders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/auth/providers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching auth providers: ", error);
    throw error;
  }
};

export const fetchAuthSession = async () => {
  try {
    const response = await axios.get("/api/auth/session");
    return response.data;
  } catch (error) {
    console.error("Error fetching auth session: ", error);
    throw error;
  }
};

export const fetchAuthError = async () => {
  try {
    const response = await axios.get("/api/auth/error", {
      params: {error}
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const authLog = async (message: string) => {
  try {
    const response = await axios.post("/api/auth/_log", {message});
    return response.data;
  } catch (error) {
    console.error("Error sending log: ", error);
    throw error;
  }
};
