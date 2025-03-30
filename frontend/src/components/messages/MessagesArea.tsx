import React, { useEffect, useRef } from 'react';

import MessageListItem from './MessageListItem';
import MessageNav from './MessageNav';
import NewMessageForm from './NewMessageForm';

import { useRoomSocket } from '@/hooks/useRoomSocket';
import { useAppSelector } from '@/store';
import { Message } from '@/types';

const MessagesArea: React.FC = () => {
  const room = useAppSelector((state) => state.rooms.rooms[state.rooms.currentRoomId as string]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = useRoomSocket({ roomId: room.id });

  useEffect(() => {
    if (room.name !== undefined) {
      scrollToBottom();
    }
  }, [room.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const sortedMessages = (messagesToSort: Message[]) => {
    const dupedMessages = [...messagesToSort];
    return dupedMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  if (!messages) return null;

  const messageItems = sortedMessages(messages).map((message) => (
    <MessageListItem key={message.id} message={message} />
  ));

  return (
    <div className="messagesArea">
      <MessageNav />
      <div className="messages-container">
        <ul className="message-list">
          {messageItems}
          <div ref={messagesEndRef}></div>
        </ul>
        <NewMessageForm />
      </div>
    </div>
  );
};

export default MessagesArea;
