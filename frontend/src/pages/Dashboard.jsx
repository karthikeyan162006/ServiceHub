import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService, providerService, reviewService } from '../services/api';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [reviewModal, setReviewModal] = useState({ show: false, providerId: null, bookingId: null });
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    
    const [providerProfile, setProviderProfile] = useState(null);
    const [needsProfile, setNeedsProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        serviceType: '',
        location: user?.address || '',
        experience: 0,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (user.role === 'PROVIDER') {
            checkProviderProfile();
        } else {
            fetchUserBookings();
        }
    }, []);

    const checkProviderProfile = async () => {
        setLoading(true);
        try {
            const res = await providerService.getByUserId(user.id);
            setProviderProfile(res.data);
            fetchProviderBookings(res.data.id);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setNeedsProfile(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getByUser(user.id);
            setBookings(response.data);
        } catch (err) {
            console.error("Failed to fetch user bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProviderBookings = async (providerId) => {
        setLoading(true);
        try {
            const response = await bookingService.getByProvider(providerId);
            setBookings(response.data);
        } catch (err) {
            console.error("Failed to fetch provider bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...profileForm,
                name: user.name,
                phone: user.phone,
                userId: user.id
            };
            const res = await providerService.add(payload);
            setProviderProfile(res.data);
            setNeedsProfile(false);
            fetchProviderBookings(res.data.id);
        } catch (err) {
            console.error("Failed to create provider profile", err);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await bookingService.updateStatus(id, status);
            if (user.role === 'PROVIDER' && providerProfile) {
                fetchProviderBookings(providerProfile.id);
            } else {
                fetchUserBookings();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                user: { id: user.id },
                provider: { id: reviewModal.providerId },
                rating: parseInt(reviewData.rating),
                comment: reviewData.comment
            };
            await reviewService.add(payload);
            setReviewModal({ show: false, providerId: null, bookingId: null });
            setReviewData({ rating: 5, comment: '' });
            alert('Review submitted successfully!');
        } catch (err) {
            console.error("Failed to submit review", err);
            alert('Failed to submit review');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'ACCEPTED': return 'status-accepted';
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED': return 'status-cancelled';
            default: return '';
        }
    };

    return (
        <div className="dashboard-container animate-fade-in container">
            <div className="dashboard-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Hello, <span>{user?.name}</span></h2>
                <p style={{ color: 'var(--text-muted)' }}>
                    {user?.role === 'PROVIDER' ? 'Manage your service requests and availability' : 'Track your service bookings and history'}
                </p>
            </div>

            <div className="dashboard-content glass" style={{ padding: '2rem', borderRadius: 'var(--radius-2xl)' }}>
                {user?.role === 'PROVIDER' && needsProfile ? (
                    <div className="auth-card" style={{margin: '0 auto', background: 'transparent', boxShadow: 'none', border: 'none'}}>
                        <h3 style={{ marginBottom: '1rem' }}>Complete Your <span>Pro Profile</span></h3>
                        <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>Finish your setup to start receiving service requests in your area.</p>
                        <form onSubmit={handleCreateProfile} className="auth-form">
                            <div className="form-group">
                                <label>Service Type (e.g. Plumber)</label>
                                <input 
                                    type="text" 
                                    value={profileForm.serviceType} 
                                    onChange={(e) => setProfileForm({...profileForm, serviceType: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Location / City</label>
                                <input 
                                    type="text" 
                                    value={profileForm.location} 
                                    onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Years of Professional Experience</label>
                                <input 
                                    type="number" 
                                    value={profileForm.experience} 
                                    onChange={(e) => setProfileForm({...profileForm, experience: parseInt(e.target.value)})} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create My Pro Profile</button>
                        </form>
                    </div>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '2rem' }}>{user?.role === 'PROVIDER' ? 'Active Requests' : 'Your Appointments'}</h3>
                        {loading ? (
                            <div className="loading-spinner">Fetching details...</div>
                        ) : bookings.length > 0 ? (
                            <div className="table-responsive">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            {user?.role === 'PROVIDER' ? (
                                                <>
                                                    <th>Customer</th>
                                                    <th>Contact</th>
                                                    <th>Address</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th>Service</th>
                                                    <th>Provider</th>
                                                </>
                                            )}
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(booking => (
                                            <tr key={booking.id}>
                                                {user?.role === 'PROVIDER' ? (
                                                    <>
                                                        <td>{booking.user?.name}</td>
                                                        <td>{booking.user?.phone}</td>
                                                        <td>{booking.address}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td><strong style={{ color: 'var(--primary-color)' }}>{booking.provider?.serviceType.toUpperCase()}</strong></td>
                                                        <td>{booking.provider?.name}</td>
                                                    </>
                                                )}
                                                <td>{booking.date} at {booking.time}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {user?.role === 'PROVIDER' ? (
                                                        <div style={{display: 'flex', gap: '8px'}}>
                                                            {booking.status === 'PENDING' && (
                                                                <>
                                                                    <button className="btn-primary btn-sm" onClick={() => updateBookingStatus(booking.id, 'ACCEPTED')}>Accept</button>
                                                                    <button className="btn-secondary btn-sm" onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}>Decline</button>
                                                                </>
                                                            )}
                                                            {booking.status === 'ACCEPTED' && (
                                                                <button className="btn-primary btn-sm" onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}>Complete</button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        booking.status === 'COMPLETED' ? (
                                                            <button 
                                                                className="btn-secondary btn-sm" 
                                                                onClick={() => setReviewModal({ show: true, providerId: booking.provider.id, bookingId: booking.id })}
                                                            >
                                                                Rate Service
                                                            </button>
                                                        ) : (
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No action needed</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-results" style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{user?.role === 'PROVIDER' ? 'No active service requests at the moment.' : 'You haven\'t booked any services yet.'}</p>
                                {user?.role === 'CUSTOMER' && (
                                    <button className="btn-primary" onClick={() => navigate('/services')}>Explore Services</button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {reviewModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050
                }}>
                    <div className="auth-card glass" style={{ margin: '0', padding: '3rem', maxWidth: '450px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Share Your <span>Experience</span></h3>
                        <form onSubmit={handleReviewSubmit} className="auth-form">
                            <div className="form-group">
                                <label>Rating</label>
                                <select 
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-lg)', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ Very Good</option>
                                    <option value="3">⭐⭐⭐ Good</option>
                                    <option value="2">⭐⭐ Fair</option>
                                    <option value="1">⭐ Poor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Your Feedback</label>
                                <textarea 
                                    rows="4"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    required
                                    placeholder="Tell us how the service was..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-lg)', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', color: '#fff' }}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Review</button>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setReviewModal({ show: false, providerId: null, bookingId: null })}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
