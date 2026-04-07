import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providerService, bookingService } from '../services/api';

const Booking = () => {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [provider, setProvider] = useState(null);
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        address: user?.address || ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProvider();
    }, [providerId]);

    const fetchProvider = async () => {
        try {
            const response = await providerService.getById(providerId);
            setProvider(response.data);
        } catch (err) {
            setError('Provider not found.');
        }
    };

    const handleChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                user: { id: user.id },
                provider: { id: parseInt(providerId) },
                date: bookingData.date,
                time: bookingData.time,
                address: bookingData.address
            };
            await bookingService.create(payload);
            setSuccess('Booking created successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to create booking.');
        }
    };

    if (!provider) return <div className="loading-spinner">Loading provider details...</div>;

    return (
        <div className="auth-container booking-container animate-fade-in">
            <div className="auth-card glass">
                <h2 style={{ marginBottom: '1rem' }}>Book <span>{provider.name}</span></h2>
                <div className="provider-summary" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Specialty: <strong style={{ color: '#fff' }}>{provider.serviceType}</strong></p>
                    <p style={{ color: 'var(--text-muted)' }}>Experience: <strong style={{ color: '#fff' }}>{provider.experience} years</strong></p>
                    <p style={{ color: 'var(--text-muted)' }}>Rating: <strong style={{ color: '#fff' }}>⭐ {provider.averageRating || 'New'}</strong></p>
                </div>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert">{success}</div>}

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>Service Date</label>
                        <input type="date" name="date" value={bookingData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Preferred Time</label>
                        <input type="time" name="time" value={bookingData.time} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Service Address</label>
                        <textarea 
                            name="address" 
                            value={bookingData.address} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-lg)', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', color: '#fff', minHeight: '100px' }}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Confirm Appointment</button>
                    <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ width: '100%' }}>Go Back</button>
                </form>
            </div>
        </div>
    );
};

export default Booking;
