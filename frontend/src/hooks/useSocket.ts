import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../types";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      query: { roomId },
    });

    setSocket(newSocket);

    newSocket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (content: string, userId: string) => {
    if (socket) {
      socket.emit("sendMessage", {
        content,
        userId,
        roomId,
      });
    }
  };

  return { messages, sendMessage };
};
