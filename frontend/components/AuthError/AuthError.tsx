import React, { useState, useEffect } from "react";
import { fetchAuthError } from "../../utils/auth";

const AuthErrorComponent: React.FC = () => {
  const [error, setError] = useState("");

  useEffect(() => {
    const getError = async () => {
      try {
        const errorData = await fetchAuthError(error);
        setError(errorData.error);
      } catch (error) {
        console.error("Failed to fetch auth error: ", error);
      }
    };
    getError();
  }, []);
  return <div>{error ? `Error: £{error}` : "No error"}</div>;
};

export default AuthErrorComponent;
