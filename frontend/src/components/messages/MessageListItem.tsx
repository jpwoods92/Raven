import React from 'react';
import Timestamp from 'react-timestamp';

import { Message } from '@/types';

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  if (!message) return null;
  return (
    <li className="message-list-item">
      <img className="avatar-img" src={message.user?.avatar} alt="" />
      <div className="message-item-contents">
        <div className="username-timestamps-container">
          <div className="message-username">
            {message.user?.displayname || message.user?.username}
          </div>
          <Timestamp className="timestamp" date={message.createdAt} options={{ format: 'time' }} />
        </div>
        <div className="message-body">{message.content}</div>
      </div>
    </li>
  );
};

export default MessageListItem;
