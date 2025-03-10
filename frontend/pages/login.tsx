import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../styles/auth.module.css";
import loginStyles from "../styles/loginform.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { signIn } from "next-auth/react";
import { fetchAuthProviders } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [providers, setProviders] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const loadProviders = async () => {
        try {
          const data = await fetchAuthProviders();
          setProviders(data.providers);
        } catch (error) {
          console.error("Error fetching auth providers:", error);
        }
      };
      loadProviders();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });
      console.log("API Response: ", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored in local storage");
        router.push("/");
        console.log("Redirecting to homepage");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || "An error occured");
      } else {
        setError("An unexpected error occured");
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={loginStyles.wrapper}>
        <form onSubmit={handleLogin} action="">
          <h1>Login</h1>
          <div className={loginStyles["input-box"]}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className={loginStyles.icon} />
          </div>
          <div className={loginStyles["input-box"]}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={loginStyles.icon} />
          </div>

          <div className={loginStyles["remember-forget"]}>
            {/* <label>
              <input type="checkbox" />
              Remember Details
            </label> */}
            {/* <a href="/forgotpassword">Forgot Password?</a> */}
          </div>
          <button type="submit">Login</button>
          <div className={loginStyles["register-link"]}>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
