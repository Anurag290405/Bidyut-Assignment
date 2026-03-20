import React, { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

const Chat = () => {
    const { user, logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Fetch historical messages
        const fetchMessages = async () => {
            try {
                const res = await api.get('/messages');
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();

        // Connect to Socket.io with credentials (to send cookies)
        const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://bidyut-assignment.onrender.com';
        const newSocket = io(BACKEND_URL, {
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => newSocket.close();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        // Emit through socket
        socket.emit('sendMessage', newMessage);
        setNewMessage('');
    };

    const handleLogout = () => {
        if (socket) socket.disconnect();
        logout();
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Global Chat</h1>
                    <p className="text-sm text-gray-500">Logged in as: <span className="font-semibold">{user?.username}</span></p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                >
                    Logout
                </button>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id || msg.senderName === user?.username;
                        
                        return (
                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-xs text-gray-400 mb-1">{msg.senderName}</span>
                                <div className={`px-4 py-2 rounded-lg break-words max-w-xs md:max-w-md ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Chat Input */}
            <footer className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex max-w-4xl mx-auto space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chat;
