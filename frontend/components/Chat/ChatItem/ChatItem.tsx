import React from "react";
import GPTLogo from "@/components/icons/GPTLogo";
import Pencil from "@/components/icons/Pencil";
import ThumbsUp from "@/components/icons/ThumbsUp";
import ThumbsDown from "@/components/icons/ThumbsDown";
import { MessageItem } from "../Chat";
import ImageSet from "../ImageSet";

export default function ChatItem({ item }: { item: MessageItem }) {
  return (
    <div className="py-2" key={item.key} data-testid="chat-item">
      <div className="flex p-2 rounded-md bg-item">
        <div className="w-12 shrink-0">
          <div className="grid w-11 h-11 place-items-center">
            {item.isUser ? (
              <div
                className="w-10 h-10 bg-center bg-cover rounded-full"
                style={{
                  backgroundImage: 'url("/pfp.jpg")',
                }}></div>
            ) : (
              <div className="grid rounded-full w-9 h-9 place-items-center bg-brandWhite">
                <GPTLogo className="w-6 h-6 text-blue-900" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between h-10 px-3 grow text-brandGray">
            <div className="text-sm"> 12 dec </div>
            {item.isUser ? (
              <div className="inline-flex items-center">
                <button className="grid rounded-md w-7 h-7 place-items-center">
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2">
                <button className="grid rounded-md w-7 h-7 place-items-center">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="grid rounded-md w-7 h-7 place-items-center">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div
            className={`px-3 pb-3 ${
              item.isUser ? "text-white" : "text-brandGray"
            }`}>
            {item.text}
          </div>
          {item.images && <ImageSet images={item.images} />}
        </div>
      </div>
    </div>
  );
}
