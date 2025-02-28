import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../styles/auth.module.css";
import loginStyles from "../styles/loginform.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  //  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(result.error);
      console.log("Login error: ", result.error);
    } else {
      router.push("/");
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
