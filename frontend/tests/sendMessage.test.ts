import axios from "axios";
import { sendMessage } from "../lib/sendMessage";
import { MessageItem } from "../components/Chat/Chat";

jest.mock("axios");

describe("sendMessage", () => {
  it("should send a message and update the state", async () => {
    const mockSetMessages = jest.fn();
    const mockSetConversations = jest.fn();
    const conversationKey = "test-conversationKey";
    const messageText = "Hello World";

    (axios.post as jest.Mock).mockResolvedValue({
      data: { answer: "Hi there!" },
    });

    await sendMessage(
      messageText,
      conversationKey,
      mockSetMessages,
      mockSetConversations
    );

    const calls = mockSetMessages.mock.calls.map((call) => call[0]([]));

    console.log("mockSetMessages calls:", calls);

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
                    text: 'Hi there!', 
                    conversationKey,
                })
            ])
        ])
    )
  });
});
