# Real-Time MERN Chat Application

**Live Links:**
- **Frontend (Vercel):** [https://bidyut-assignment.vercel.app](https://bidyut-assignment.vercel.app)
- **Backend (Render):** [https://bidyut-assignment.onrender.com](https://bidyut-assignment.onrender.com)

A production-ready, minimal real-time chat application built using the MERN stack with Socket.io and JWT authentication.

## Features Implemented
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT (HTTP-only cookies).
- **Frontend:** React (Vite), Tailwind CSS, React Router, Context API, Axios.
- **Security:** bcrypt password hashing, HTTP-only JWT cookies, Socket.io cookie validation.
- **Functionality:** Signup, Login, global real-time chat, persistent messages, auto-scrolling UI.

## File Structure
```text
backend/     # Node.js, Express, Socket.io, MongoDB server
frontend/    # React (Vite) + Tailwind CSS application
```

## How to Run Locally

Before starting, ensure you have **Node.js** and **MongoDB** installed and running on your system.
By default, the backend expects MongoDB to be running locally at `mongodb://127.0.0.1:27017/chatapp`. If you are using MongoDB Atlas, update `MONGO_URI` in `backend/.env`.

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The Express server will start on `http://localhost:5000`.

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The React app will start on `http://localhost:5173`.

### 3. Verification
1. Open `http://localhost:5173` in your browser.
2. Register a new user account.
3. Open a second browser or an incognito window, register a second user.
4. Send messages back and forth—they will appear instantly in real-time across both screens.
