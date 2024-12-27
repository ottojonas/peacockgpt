import React, { useState } from "react";
import axios, { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", { email, password });
      alert(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // * Handle AxiosError
        alert(error.response?.data.error || "An error occurred");
      } else {
        // * Handle other errors
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="left">
        <h1>
          WELCOME BACK TO
          <br />
          PEACOCKGPT
        </h1>
      </div>
      <div className="right">
        <div className="form-container">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="e.g: johndoe@email.com"
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
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
