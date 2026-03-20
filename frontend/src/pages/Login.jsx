import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser(res.data);
            localStorage.setItem('chatUser', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" required placeholder="Email"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-green-500" 
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" required placeholder="Password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-green-500" 
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    New here? <Link to="/register" className="text-green-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
