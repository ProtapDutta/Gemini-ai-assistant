import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatMessage from './ChatMessage';
import CONTEXT from './Context'; 

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const chatBodyRef = useRef(null); // Add ref

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, minimized]); 

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chatHistory = [
        {
          role: 'user',
          parts: [{ text: CONTEXT + '\n\n' + input }]
        }
      ];

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: { temperature: 0.7 }
      });

      const result = await chat.sendMessage(input);
      const response = await result.response.text();

      setMessages((prev) => [...prev, { from: 'bot', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Sorry, something went wrong.' }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className={`chatbot${minimized ? ' minimized' : ''}`}>
      <div className="chat-header">
        TATA Motors Asssistant 
        <button
          className="minimize-btn"
          onClick={() => setMinimized((m) => !m)}
          aria-label={minimized ? 'Maximize' : 'Minimize'}
        >
          {minimized ? '🔼' : '🔽'}
        </button>
      </div>
      {!minimized && (
        <>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} />
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask Any Question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;