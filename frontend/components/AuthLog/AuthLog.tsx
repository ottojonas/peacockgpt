import React, { useState } from "react";
import { authLog } from "../../utils/auth";

const AuthLogComponent: React.FC = () => {
  const [message, setMessage] = useState("");
  const handleLog = async () => {
    try {
      const response = await authLog(message);
      console.log("Log response: ", response);
    } catch (error) {
      console.error("Failed to send log message: ", error);
    }
  };
  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter log message"
      />
      <button onClick={handleLog}>Send Log</button>
    </div>
  );
};
