import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { theme } from '../theme';
import { Lock, Mail, MessageSquare } from 'lucide-react';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser(res.data);
            localStorage.setItem('chatUser', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={theme.styles.pageWrapper}>
            <div className={theme.styles.card}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-md mb-3 text-white">
                        <MessageSquare size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Campus Chat</h1>
                    <p className="text-gray-500 text-sm mt-1">Connect instantly with your peers</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                        <input 
                            type="email" required placeholder="Email address"
                            className={theme.styles.input + " pl-10"} 
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                        <input 
                            type="password" required placeholder="Password"
                            className={theme.styles.input + " pl-10"} 
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className={theme.styles.button}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    New here? <Link to="/register" className="text-green-600 font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
