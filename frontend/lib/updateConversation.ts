import axios from "axios";

export const updateConversation = async (
  key: string,
  title: string,
  desc: string
) => {
  try {
    const response = await axios.put(`/api/conversations?key=${key}`, {
      title,
      desc,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};
