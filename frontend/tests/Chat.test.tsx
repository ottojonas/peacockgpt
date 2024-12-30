import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "../components/Chat";
import axios from "axios";
import { sendMessage as sendMsg } from "../lib/sendMessage";
jest.mock("axios");

describe("Chat Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.log as jest.Mock).mockRestore();
  });
  it("should mount and unmount correctly", () => {
    const { unmount } = render(
      <Chat
        messages={[]}
        setMessages={() => {}}
        conversationKey="test"
        sendMessage={() => {}}
      />
    );
    expect(console.log).toHaveBeenCalledWith("chat component mounted");
    unmount();
    expect(console.log).toHaveBeenCalledWith("chat component unmounted");
  });

  it("should add a new message when sendMessage is called", async () => {
    const mockSetMessages = jest.fn();
    const mockSetConversations = jest.fn();
    const conversationKey = "test-conversationKey";
    const messageText = "Hello World";

    (axios.post as jest.Mock).mockResolvedValue({
      data: { answer: "Hi there!" },
    });

    await sendMsg(
      messageText,
      conversationKey,
      mockSetMessages,
      mockSetConversations
    );

    const calls = mockSetMessages.mock.calls.map((call) => call[0]([]));

    expect(calls).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            text: messageText,
            conversationKey,
          }),
        ]),
        expect.arrayContaining([
          expect.objectContaining({
            text: "Hi there!",
            conversationKey,
          }),
        ]),
      ])
    );
  });

  it("should render ChatItem components based on messages state", () => {
    const initialMessages = [
      {
        key: "0",
        text: "Hello",
        isUser: true,
        conversationKey: "test",
        sender: "user",
        images: [],
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
        content: "text",
      },
      {
        key: "1",
        text: "Hi",
        isUser: false,
        conversationKey: "test",
        sender: "bot",
        images: [],
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
      },
    ];
    render(
      <Chat
        messages={initialMessages}
        setMessages={() => {}}
        conversationKey="test"
        sendMessage={() => {}}
      />
    );
    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(initialMessages.length);
    expect(messages[0]).toHaveTextContent(/Hello/);
    expect(messages[1]).toHaveTextContent(/Hi/);
  });

  it("should call sendMessage when a message is sent from ChatInput", () => {
    const mockSendMessage = jest.fn();
    render(
      <Chat
        messages={[]}
        setMessages={() => {}}
        conversationKey="test"
        sendMessage={mockSendMessage}
      />
    );
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockSendMessage).toHaveBeenCalledWith("Test message");
  });

  it("should render ChatInput component", () => {
    render(
      <Chat
        messages={[]}
        setMessages={() => {}}
        conversationKey="test"
        sendMessage={() => {}}
      />
    );
    const input = screen.getByPlaceholderText("Type a message...");
    expect(input).toBeInTheDocument();
  });
});
