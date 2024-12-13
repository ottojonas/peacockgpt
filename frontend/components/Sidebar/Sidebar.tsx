import GPTLogo from "@/components/icons/GPTLogo";
import LogoutIcon from "@/components/icons/LogoutIcon";
import ThemeIcon from "@/components/icons/ThemeIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import UsersIcon from "@/components/icons/UsersIcon";
import DashboardIcon from "@/components/icons/DashboardIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import React = require("react");

type Props = {};

export default function Sidebar({}: Props) {
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
        <button className="grid w-10 h-10 rounded-md place-items-center text-brandGray">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col pb-4 space-y-4 shrink-0">
        <button className="grid w-10 h-10 text-white rounded-md place-items-center">
          <ThemeIcon className="w-5 h-5" />
        </button>
        <button className="grid w-10 h-10 text-white rounded-md place-items-center bg-card">
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
