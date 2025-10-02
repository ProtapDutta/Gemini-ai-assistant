import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ChatMessage from './ChatMessage';
import CONTEXT from './Context';

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const Chatbot = () => {
    // Initialize messages as an empty array [] 
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
        // Use spread syntax for cleaner state update
        setMessages(prev => [...prev, userMessage]); 
        setInput('');
        setLoading(true);

        try {
            const modelName = 'gemini-2.5-flash'; 

            // **1. DEFINE CONCISE INSTRUCTION 
            const CONCISE_INSTRUCTION = "You are a TATA Motors Assistant. Your goal is to provide **short, direct, and concise answers**, ideally in 1-3 sentences. Do not elaborate unless asked.";
            
            // Create the initial history/context array for the model.
            // This is the first "turn" that defines the bot's behavior.
            const initialHistory = [
                {
                    role: 'user',
                    // Combine the instruction and context into the first user message
                    parts: [{ text: CONCISE_INSTRUCTION + '\n\nCONTEXT:\n' + CONTEXT }]
                },
                {
                    role: 'model',
                    // The model acknowledges the instruction
                    parts: [{ text: "Acknowledged. I will provide concise answers about TATA Motors. How can I assist you today?" }]
                }
            ];

            // Map existing messages into the API format
            const existingHistory = messages
                // Filter out empty messages to prevent 400 API errors
                .filter(msg => msg.text && msg.text.trim().length > 0)
                .map(msg => ({
                    role: msg.from === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

            // Combine the initial system context with the existing chat history
            // NOTE: The user's latest message is *not* included yet.
            const fullHistory = initialHistory.concat(existingHistory);

            // Initiate a new chat session with the full history
            const chat = ai.chats.create({
                model: modelName,
                history: fullHistory,
                config: {
                    temperature: 0.7,
                    // **2. FIX FOR LENGTH ** 
                    // // Set a low maxOutputTokens to force conciseness. 50 tokens ~ 2-3 sentences
                    maxOutputTokens: 50 
                }
            });

            // Send the new user input message to the chat session
            const result = await chat.sendMessage({ message: input }); 
            const responseText = result?.text || 'No response received.';

            setMessages(prev => [...prev, { from: 'bot', text: responseText }]);
        } catch (err) {
            console.error("Gemini API Error:", err);
            // Revert the state by removing the last user message that failed
            setMessages(prev => prev.slice(0, -1).concat({ from: 'bot', text: 'Sorry, I ran into an issue. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) sendMessage();
    };

    return (
        <div className={`chatbot${minimized ? ' minimized' : ''}`}>
            <div className="chat-header">
                TATA Motors Asssistant
                <button
                    className="minimize-btn"
                    onClick={() => setMinimized(m => !m)}
                    aria-label={minimized ? 'Maximize' : 'Minimize'}
                >
                    {minimized ? '🔼' : '🔽'}
                </button>
            </div>
            {!minimized &&
                <React.Fragment>
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
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={sendMessage} disabled={loading}>➤</button>
                    </div>
                </React.Fragment>
            }
        </div>
    );
};

export default Chatbot;
