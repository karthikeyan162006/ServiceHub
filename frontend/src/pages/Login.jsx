import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { email, password } = credentials;
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await userService.login({
                email: email.trim(),
                password: password.trim()
            });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data || 'Login failed';
            if (err.response?.status === 401 || errorMessage === 'Invalid credentials') {
                setError('Invalid credentials');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card glass">
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Welcome <span>Back</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to SERVICE HUB</p>
                </div>
                
                {error && <div className="error-alert">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={credentials.email} 
                            onChange={handleChange} 
                            placeholder="john@example.com"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            placeholder="••••••••"
                            required 
                        />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Forgot password?</Link>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Login to Account'}
                    </button>
                    <p className="auth-redirect" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        New to SERVICE HUB? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
