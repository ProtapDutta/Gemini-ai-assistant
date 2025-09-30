import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai'; 
import ChatMessage from './ChatMessage';
import CONTEXT from './Context';

// Initialize the new client
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
            const modelName = 'gemini-2.5-flash'; 

            // **MODIFICATION 1: Update CONTEXT to include conciseness instruction**
            // Note: I assume CONTEXT is imported from './Context', so you'd update that file.
            // For this example, I'll simulate the instruction by pre-pending it here.
            const CONCISE_INSTRUCTION = "You are a TATA Motors Assistant. Your goal is to provide **short, direct, and concise answers**, ideally in 1-3 sentences. Do not elaborate unless asked.";
            
            const initialHistory = [
                {
                    role: 'user',
                    // Use the combination of the CONCISE_INSTRUCTION and the CONTEXT
                    parts: [{ text: CONCISE_INSTRUCTION + '\n\n' + CONTEXT }] 
                },
                {
                    role: 'model',
                    parts: [{ text: "Acknowledged. I will provide concise answers about TATA Motors. How can I assist you today?" }]
                }
            ];

            const existingHistory = messages.map(msg => ({
                role: msg.from === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const fullHistory = [...initialHistory, ...existingHistory];
            
            // Initiate a new chat session with the full history
            const chat = ai.chats.create({
                model: modelName,
                history: fullHistory,
                config: {
                    temperature: 0.7, 
                    // **MODIFICATION 2: ADD MAX OUTPUT TOKENS**
                    // This is the most effective way to limit response length.
                    // 50 tokens is usually enough for 2-3 concise sentences.
                    maxOutputTokens: 50 
                }
            });

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