import ChatIcon from "@/components/icons/ChatIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import SaveIcon from "@/components/icons/SaveIcon";
import React from "react";

export default function ChatHeader() {
  return (
    <div className="fixed top-0 inset-x-0 z-10">
      <div
        className="bg-body border-b border-b-line z-10 bg-opacity-30 backdrop-blur-md"
        style={{ marginLeft: "384px", marginRight: "320px" }}
      >
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between py-2">
          <div className="inline-flex items-center">
            <ChatIcon className="w-6 h-6" />
            <h1 className="ml-2 font-semibold text-xl">PeacockGPT</h1>
          </div>
          <div className="inline-flex items-center space-x-3">
            <button
              className="w-9 h-9 grid place-items-center bg-card rounded-md"
              onClick={() => {}}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <button
              className="w-9 h-9 grid place-items-center bg-card rounded-md"
              onClick={() => {}}
            >
              <SaveIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
