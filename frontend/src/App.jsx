import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import api from './utils/axios';

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('chatUser');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        // Validate session on load
        api.get('/auth/profile').then(res => {
            setUser(res.data);
            localStorage.setItem('chatUser', JSON.stringify(res.data));
        }).catch(() => {
            setUser(null);
            localStorage.removeItem('chatUser');
        });
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
                <Route path="/" element={user ? <Chat user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
