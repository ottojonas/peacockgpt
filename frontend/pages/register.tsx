import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/auth.module.css";
import registerStyles from "@/styles/registerform.module.css";
import { FaUser, FaLock } from "react-icons/fa";

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
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.error || "An error occurred");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={registerStyles.wrapper}>
        <form action="" onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className={registerStyles["input-box"]}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className={registerStyles.icon} />
          </div>
          <div className={registerStyles["input-box"]}>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={registerStyles.icon} />
          </div>
          <button type="submit">Register</button>
          <div className={registerStyles["login-link"]}>
            <p>
              Already have an account? <a href="/login">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
