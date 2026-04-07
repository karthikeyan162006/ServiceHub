import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await userService.forgotPassword({ email });
            setSuccess(response.data || 'OTP sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await userService.resetPassword({ email, otp, newPassword });
            setSuccess(response.data || 'Password updated successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password. Check OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card glass">
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Password <span>Reset</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {step === 1 ? 'Enter your email to receive recovery instructions.' : 'Enter the OTP sent to your email and your new password.'}
                    </p>
                </div>
                
                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '2rem' }}>{success}</div>}
                
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="john@example.com"
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
                            {loading ? 'Sending logic...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label>OTP Code</label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                placeholder="123456"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="auth-redirect" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in instead</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
