import React, { useEffect, useState } from "react";
import axios from "axios";

const Protected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    }
  }, []);

  if (!isAuthenticated) {
    return <div>please login to access page</div>;
  }
  return <div>protected content</div>;
};

export default Protected;
