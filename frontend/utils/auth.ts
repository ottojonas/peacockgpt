export const fetchAuthProviders = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/auth/providers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch auth providers");
  }
  const data = await response.json();
  return data;
};
