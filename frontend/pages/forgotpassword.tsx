import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/auth.module.css";
import forgotPasswordStyles from "@/styles/forgotpassword.module.css";
import { FaUser, FaLock } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNewPassword = async () => {
    try {
      const response = await axios.post("/api/newpassword", {
        email,
        newPassword,
      });
      alert(response.data.message);
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.error || "An error occured");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };
  return (
    <div className={styles.authWrapper}>
      <div className={forgotPasswordStyles.wrapper}>
        <form onSubmit={handleNewPassword} action="">
          <h1>Reset Password</h1>
          <div className={forgotPasswordStyles["input-box"]}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className={forgotPasswordStyles.icon} />
          </div>
          <div className={forgotPasswordStyles["input-box"]}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FaLock className={forgotPasswordStyles.icon} />
          </div>
          <button type="submit">Reset Password</button>
          <div className={forgotPasswordStyles["register-link"]}>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
