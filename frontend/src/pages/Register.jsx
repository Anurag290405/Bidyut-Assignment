import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { theme } from '../theme';
import { Lock, Mail, User, MessageSquare, Eye, EyeOff } from 'lucide-react';

const Register = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/register', { username, email, password });
            setUser(res.data);
            localStorage.setItem('chatUser', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                        <input 
                            type="text" required placeholder="Full name"
                            className={theme.styles.input + " pl-10"} 
                            value={username} onChange={e => setUsername(e.target.value)}
                        />
                    </div>
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
                            type={showPassword ? "text" : "password"} required placeholder="Password"
                            className={theme.styles.input + " pl-10 pr-10"} 
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 focus:outline-none transition-colors p-1"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                        <input 
                            type={showConfirmPassword ? "text" : "password"} required placeholder="Confirm Password"
                            className={theme.styles.input + " pl-10 pr-10"} 
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 focus:outline-none transition-colors p-1"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className={theme.styles.button}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
