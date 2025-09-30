import React, { useState, useRef, useEffect } from 'react';
// 1. **UPDATE SDK IMPORT:** Change from '@google/generative-ai' 
//    to the new, unified '@google/genai'
import { GoogleGenAI } from '@google/genai'; 
import ChatMessage from './ChatMessage';
import CONTEXT from './Context';

// 2. **UPDATE CLIENT INITIALIZATION:** Instantiate the new client.
//    The key is automatically picked up from the environment variable (VITE_GEMINI_API_KEY).
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }); 

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [minimized, setMinimized] = useState(false);
    const [loading, setLoading] = useState(false);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, minimized, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { from: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // **3. UPDATE MODEL NAME and CHAT STRUCTURE**
            // The recommended model is 'gemini-2.5-flash' (alias for the latest stable flash model)
            const modelName = 'gemini-2.5-flash'; 

            // Create the initial history/context array for the model.
            // This sets the context for the *entire* chat session.
            const initialHistory = [
                {
                    role: 'user',
                    parts: [{ text: CONTEXT }]
                },
                {
                    // You must follow an 'user' message with a 'model' message 
                    // to complete the turn structure for history.
                    role: 'model',
                    parts: [{ text: "Acknowledged. How can I assist you with TATA Motors today?" }]
                }
            ];

            // Map existing messages into the format required for a new chat session history
            const existingHistory = messages.map(msg => ({
                role: msg.from === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            // Combine the initial system context with the existing chat history
            const fullHistory = [...initialHistory, ...existingHistory];
            
            // Initiate a new chat session with the full history
            const chat = ai.chats.create({
                model: modelName,
                history: fullHistory,
                config: {
                    temperature: 0.7 
                }
            });

            // Send the new user input message to the chat session
            // NOTE: The CONTEXT is now only in the history, not prepended to every message.
            const result = await chat.sendMessage({ message: input });
            const responseText = result.text;

            setMessages((prev) => [...prev, { from: 'bot', text: responseText }]);
        } catch (err) {
            console.error("Gemini API Error:", err);
            setMessages((prev) => [
                ...prev,
                { from: 'bot', text: 'Sorry, I ran into an issue. Please try again.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of the component remains the same)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) sendMessage();
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
                        {loading && (
                            <div className="chat-message bot">
                                <em>Thinking...</em>
                            </div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Ask Any Question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={sendMessage} disabled={loading}>➤</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;