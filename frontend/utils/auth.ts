import axios from "axios";
import { getProviders } from "next-auth/react";

export const fetchAuthProviders = async () => {
  console.log("fetching auth providers...")
  try {
    const providers = await getProviders(); 
    if (providers) {
      console.log("Providers: ", providers)
      return providers
    } else {
      console.warn("Providers data is null, returning an empty object")
      return {}
    }
  } catch (error) {
    console.error("Error fetching auth providers: ", error)
    return {}
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
