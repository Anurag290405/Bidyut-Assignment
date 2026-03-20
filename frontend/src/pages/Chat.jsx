import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/axios';
import MessageBubble from '../components/MessageBubble';

const Chat = ({ user, setUser }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Fetch historical messages
        api.get('/messages').then(res => setMessages(res.data)).catch(console.error);

        // Connect Socket
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://bidyut-assignment.onrender.com';
        const newSocket = io(BACKEND_URL, { withCredentials: true });
        
        setSocket(newSocket);
        newSocket.on('receiveMessage', (message) => setMessages(prev => [...prev, message]));

        return () => newSocket.close();
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket) return;
        socket.emit('sendMessage', inputValue);
        setInputValue('');
    };

    const handleLogout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('chatUser');
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#e5ddd5] overflow-hidden overscroll-none">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#075e54] text-white shadow-md z-10 w-full shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold">Campus Chat</h1>
                    <span className="text-xs text-gray-200">Logged in as {user?.username}</span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1 text-sm bg-white text-[#075e54] font-medium rounded hover:bg-gray-100 transition">
                    Logout
                </button>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-3 w-full overscroll-contain">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === user?._id || msg.senderName === user?.username;
                    return <MessageBubble key={idx} message={msg} isMe={isMe} />;
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="bg-[#f0f0f0] p-3 shadow-inner w-full shrink-0">
                <form onSubmit={handleSend} className="flex max-w-4xl mx-auto gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-white rounded-full outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
                    />
                    <button 
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="px-6 py-2 text-white font-medium bg-[#128c7e] rounded-full hover:bg-[#075e54] disabled:opacity-50 transition shadow-sm"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chat;
