import React, { useState } from "react";
import axios, { AxiosError } from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("/api/register", { email, password });
      alert(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle AxiosError
        alert(error.response?.data.error || "An error occurred");
      } else {
        // Handle other errors
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h2>register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>register</button>
    </div>
  );
};

export default Register;
