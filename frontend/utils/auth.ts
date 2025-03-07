import axios from "axios";

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
