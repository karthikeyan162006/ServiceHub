import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        role: 'CUSTOMER',
        otp: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            setError('Please enter an email address first.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            await userService.requestOtp({ email: formData.email });
            setOtpSent(true);
            setSuccessMessage('OTP sent successfully to your email.');
        } catch (err) {
            setError(err.response?.data || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Manual validation check
        const { name, email, phone, password, address, otp } = formData;
        if (!name.trim() || !email.trim() || !password.trim() || !address.trim() || (otpSent && !otp.trim())) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            // Send trimmed data
            const trimmedData = {
                ...formData,
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                address: address.trim(),
                otp: otp.trim()
            };
            await userService.register(trimmedData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card glass" style={{ maxWidth: '600px' }}>
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Join <span>SERVICE HUB</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Create an account to start booking or providing services</p>
                </div>
                
                {error && <div className="error-alert">{error}</div>}
                {successMessage && <div className="success-alert">{successMessage}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                        </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required style={{ flex: 1 }} />
                            <button type="button" onClick={handleSendOtp} className="btn-secondary" style={{ padding: '0.75rem 1rem' }} disabled={otpSent || loading}>
                                {loading ? '...' : otpSent ? 'Resend' : 'Verify Email'}
                            </button>
                        </div>
                    </div>

                    {otpSent && (
                        <div className="form-group animate-fade-in">
                            <label>Email Verification OTP</label>
                            <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter 6-digit code from email" required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            placeholder="Your full address..." 
                            required 
                            rows="2" 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-lg)', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: formData.role === 'CUSTOMER' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', borderColor: formData.role === 'CUSTOMER' ? 'var(--primary-color)' : 'var(--border-color)' }}>
                                <input type="radio" name="role" value="CUSTOMER" checked={formData.role === 'CUSTOMER'} onChange={handleChange} style={{ display: 'none' }} />
                                <span style={{ color: formData.role === 'CUSTOMER' ? '#fff' : 'var(--text-muted)', fontWeight: '600' }}>Customer</span>
                            </label>
                            <label style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: formData.role === 'PROVIDER' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', borderColor: formData.role === 'PROVIDER' ? 'var(--primary-color)' : 'var(--border-color)' }}>
                                <input type="radio" name="role" value="PROVIDER" checked={formData.role === 'PROVIDER'} onChange={handleChange} style={{ display: 'none' }} />
                                <span style={{ color: formData.role === 'PROVIDER' ? '#fff' : 'var(--text-muted)', fontWeight: '600' }}>Service Provider</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', marginBottom: '1.5rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create My Account'}
                    </button>
                    
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
