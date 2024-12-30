import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ChatInput from "../components/ChatInput/ChatInput";
import axios from "axios";

jest.mock("axios");

describe("ChatInput", () => {
  it("should render and handle message input correctly", () => {
    const mockSendMessage = jest.fn();
    const mockSetInputValue = jest.fn();
    const mockSetMessages = jest.fn();

    const { getByPlaceholderText, rerender } = render(
      <ChatInput
        sendMessage={mockSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        messages={[]}
        setMessages={mockSetMessages}
        conversationKey="testKey"
      />
    );

    const input = getByPlaceholderText("Type a message...");

    fireEvent.change(input, { target: { value: "Hello World" } });
    expect(mockSetInputValue).toHaveBeenCalledWith("Hello World");

    rerender(
      <ChatInput
        sendMessage={mockSendMessage}
        inputValue="Hello World"
        setInputValue={mockSetInputValue}
        messages={[]}
        setMessages={mockSetMessages}
        conversationKey="testKey"
      />
    );

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSendMessage).toHaveBeenCalledWith("Hello World");
  });
});
