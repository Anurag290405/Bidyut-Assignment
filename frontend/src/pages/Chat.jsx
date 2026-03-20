import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/axios';
import { theme } from '../theme';
import MessageBubble from '../components/MessageBubble';
import { LogOut, Send } from 'lucide-react';

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
        api.get('/messages').then(res => setMessages(res.data)).catch(console.error);

        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://bidyut-assignment.onrender.com';
        const newSocket = io(BACKEND_URL, { 
            withCredentials: true,
            auth: { token: user?.token }
        });
        
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
        <div className="flex flex-col h-[100dvh] w-full bg-[#e5ddd5] overflow-hidden overscroll-none font-sans">
            {/* Nav Bar - Consistent Green */}
            <header className="flex items-center justify-between px-5 py-4 bg-green-600 text-white shadow-md z-10 w-full shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold leading-none">Campus Chat</h1>
                        <span className="text-xs text-green-100 mt-1">Online as {user?.username}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Logout">
                    <LogOut size={20} />
                </button>
            </header>

            {/* Chat Area - Same background tone */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 w-full overscroll-contain">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id || msg.senderName === user?.username;
                        return <MessageBubble key={idx} message={msg} isMe={isMe} />;
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Footer Area - Card-like styling */}
            <footer className="bg-white border-t border-gray-200 p-4 shadow-lg w-full shrink-0">
                <form onSubmit={handleSend} className="flex max-w-4xl mx-auto gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className={theme.styles.input + " py-3"}
                    />
                    <button 
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chat;
