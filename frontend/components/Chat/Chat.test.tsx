import React, { useState, useEffect } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chat from "./Chat";

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Chat Component", () => {
  it("should mount and unmount correctly", () => {
    const { unmount } = render(<Chat />);
    expect(console.log).toHaveBeenCalledWith("chat component mounted");
    unmount();
    expect(console.log).toHaveBeenCalledWith("chat component unmounted");
  });

  it("should add a new message when sendMessage is called", () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello, world!" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent("Hello, world!");
  });

  it("should render ChatItem components based on messages state", () => {
    const initialMessages = [
      { key: 0, text: "Hello", isUser: true },
      { key: 1, text: "Hi", isUser: false },
    ];
    render(<Chat initialMessages={initialMessages} />);
    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(initialMessages.length);
    expect(messages[0]).toHaveTextContent("Hello");
    expect(messages[1]).toHaveTextContent("Hi");
  });

  it("should call sendMessage when a message is sent from ChatInput", () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent("Test message");
  });

  it("should render ChatInput component", () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText("Type a message...");
    expect(input).toBeInTheDocument();
  });

  it("should render messages with images correctly", () => {
    const initialMessages = [
      {
        key: 0,
        text: "Check this out",
        isUser: true,
        images: [{ key: 0, url: "https://example.com/image1.jpg" }],
      },
    ];
    render(<Chat />);
    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(initialMessages.length);
    expect(messages[0]).toHaveTextContent("Check this out");
    const image = screen.getByAltText("image1");
    expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
  });

  it("should handle messages with images in sendMessage", () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Look at this" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const messages = screen.getAllByTestId("chat-item");
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent("Look at this");
  });
});
