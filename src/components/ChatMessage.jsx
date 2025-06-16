import React from 'react';

const ChatMessage = ({ msg }) => {
  const isBot = msg.from === 'bot';
  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      <span>{msg.text}</span>
    </div>
  );
};

export default ChatMessage;
