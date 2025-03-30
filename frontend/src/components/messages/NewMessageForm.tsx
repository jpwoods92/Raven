import React, { useState } from 'react';

import { useRoomSocket } from '../../hooks/useRoomSocket';

import { useAppSelector } from '@/store';

const NewMessageForm: React.FC = () => {
  const room = useAppSelector((state) => state.rooms.rooms[state.rooms.currentRoomId as string]);
  const [body, setBody] = useState('');

  const { sendMessage } = useRoomSocket({ roomId: room.id });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (body.trim()) {
      sendMessage(body);
      setBody('');
    }
  };

  if (!room) return null;

  return (
    <div className="newMessageForm">
      <form onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${room?.name}`}
          className="message-input"
          rows={1}
          autoComplete="off"
          spellCheck={true}
        />
      </form>
    </div>
  );
};

export default NewMessageForm;
