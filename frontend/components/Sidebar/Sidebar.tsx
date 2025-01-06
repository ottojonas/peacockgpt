import GPTLogo from "../../components/icons/GPTLogo";
import LogoutIcon from "../../components/icons/LogoutIcon";
import ThemeIcon from "../../components/icons/ThemeIcon";
import ChatIcon from "../../components/icons/ChatIcon";
import UsersIcon from "../../components/icons/UsersIcon";
import DashboardIcon from "../../components/icons/DashboardIcon";
import SettingsIcon from "../../components/icons/SettingsIcon";
import { useTheme } from "../../context/ThemeContext";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

type Props = {};

// TODO

export default function Sidebar({}: Props) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSettingsClick = () => {
    router.push("/documents");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.post(
        "/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex flex-col items-center w-16 h-screen pt-4 bg-black">
      <div className="grid w-10 h-10 rounded-full bg-brandWhite shrink-0 place-items-center">
        <GPTLogo className="w-6 h-6 text-blue-900" />
      </div>
      <div className="flex flex-col pt-24 space-y-4 grow">
        <button className="grid w-10 h-10 rounded-md place-items-center text-brandGray">
          <DashboardIcon className="w-5 h-5" />
        </button>
        <button className="grid w-10 h-10 text-black rounded-md place-items-center bg-brandWhite">
          <ChatIcon className="w-5 h-5" />
        </button>
        <button className="grid w-10 h-10 rounded-md place-items-center text-brandGray">
          <UsersIcon className="w-5 h-5" />
        </button>
        <button
          className="grid w-10 h-10 rounded-md place-items-center text-brandGray"
          onClick={handleSettingsClick}
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col pb-4 space-y-4 shrink-0">
        <button
          className="grid w-10 h-10 text-white rounded-md place-items-center"
          onClick={toggleTheme}
        >
          <ThemeIcon className="w-5 h-5" />
        </button>
        <button
          className="grid w-10 h-10 text-white rounded-md place-items-center bg-card"
          onClick={handleLogout}
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
