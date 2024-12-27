import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", { email, password });
      alert(response.data.message);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.error || "An error occurred");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="left">
        <h1>
          WELCOME TO
          <br />
          PEACOCKGPT
        </h1>
      </div>
      <div className="right">
        <div className="form-container">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="e.g = johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
