import ChatIcon from "@/components/icons/ChatIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import SaveIcon from "@/components/icons/SaveIcon";
import React from "react";

// TODO

export default function ChatHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-10">
      <div
        className="z-10 border-b bg-body border-b-line bg-opacity-30 backdrop-blur-md"
        style={{ marginLeft: "384px", marginRight: "320px" }}>
        <div className="flex items-center justify-between max-w-3xl px-4 py-2 mx-auto">
          <div className="inline-flex items-center">
            <ChatIcon className="w-6 h-6" />
            <h1 className="ml-2 text-xl font-semibold">PeacockGPT</h1>
          </div>
          <div className="inline-flex items-center space-x-3">
            <button
              className="grid rounded-md w-9 h-9 place-items-center bg-card"
              onClick={() => {}}>
              <TrashIcon className="w-5 h-5" />
            </button>
            {/*
            <button
              className="grid rounded-md w-9 h-9 place-items-center bg-card"
              onClick={() => {}}>
              <SaveIcon className="w-5 h-5" />
            </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
