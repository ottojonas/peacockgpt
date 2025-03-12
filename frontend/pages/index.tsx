import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../styles/auth.module.css";
import loginStyles from "../styles/loginform.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { signIn, getSession } from "next-auth/react";
import { fetchAuthProviders } from "../utils/auth";
import io from 'socket.io-client'


const socket = io("https://peacockgpt-backend-a08e5bc3eefc.herokuapp.com", {
  transports: ["websocket"], 
  withCredentials: true, 
  reconnection: true, 
  reconnectionAttempts: 5, 
  reconnectionDelay: 1000,
})

socket.on("connect", () => {
  console.log("Scoket connected successfully") 
})

socket.on("connect_error", (error) => {
  console.error("Socket connection error: ", error)
})

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) {
      const loadProviders = async () => {
        try {
          const data = await fetchAuthProviders();
          if (data) {
            setProviders(data);
          } else {
            console.warn ("providers data is null, returning an empty object")
            setProviders({})
          }
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
      const result = await signIn("credentials", {
        redirect: false, 
        email, 
        password
      }); 
      if(result?.error) {
        setError(result.error); 
        router.push(`/api/auth/error?error=${encodeURIComponent(result.error)}`)
      } else {
        const session = await getSession(); 
        if (session && session.user){
          localStorage.setItem("user_id", session.user.id)
          router.push("https://peacockgpt.vercel.app/peacockgpt")
        }
      }
    } catch (error) {
      setError("An unexpected error has occured")
      router.push(`/api/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={loginStyles.wrapper}>
        <form onSubmit={handleLogin}>
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
          {error && <p>{error}</p> }

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
        <div>
          {Object.values(providers).map((provider:any) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
