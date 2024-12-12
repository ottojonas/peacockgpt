import data from "./data.json";
import ChatItem from "./ChatItem";

export type MessageItem =
  | {
      key: number;
      text: string;
      isUser: boolean;
      images?: undefined;
    }
  | {
      key: number;
      text: string;
      isUser: boolean;
      images: {
        key: number;
        url: string;
      }[];
    };

export default function Chat() {
  return (
    <div className=" " style={{ marginLeft: "384px", marginRight: "320px" }}>
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-48">
        {data.map((i: MessageItem) => (
          <ChatItem item={i} key={i.key} />
        ))}
      </div>
    </div>
  );
}
