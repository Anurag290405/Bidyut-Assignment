import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    }
});

app.set('io', io);

// Socket JWT Auth Middleware
io.use((socket, next) => {
    try {
        const cookieString = socket.handshake.headers.cookie;
        if (!cookieString) return next(new Error('Authentication error: No cookies'));

        const cookies = {};
        cookieString.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts[0].trim()] = decodeURI(parts[1]);
        });

        const token = cookies.jwt;
        if (!token) return next(new Error('Authentication error: No JWT token'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // { userId, username, ... }
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid Token'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected via socket: ${socket.user.username} (${socket.id})`);

    // Listen for new messages
    socket.on('sendMessage', async (text) => {
        try {
            // Save to DB
            const message = await Message.create({
                sender: socket.user.userId,
                senderName: socket.user.username,
                text,
            });

            // Broadcast to everyone
            io.emit('receiveMessage', message);
        } catch (error) {
            console.error('Error saving message via socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.username}`);
    });
});

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
