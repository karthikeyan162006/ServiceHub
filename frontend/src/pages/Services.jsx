import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { providerService } from '../services/api';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialType = queryParams.get('type') || '';

    const [providers, setProviders] = useState([]);
    const [serviceType, setServiceType] = useState(initialType);
    const [userLocation, setUserLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProviders();
    }, [location.search]);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const response = await providerService.getAll(serviceType, userLocation);
            setProviders(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch providers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProviders();
    };

    return (
        <div className="services-page animate-fade-in">
            <div className="search-section glass">
                <h2>Find Your Perfect <span>Service Pro</span></h2>
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="What do you need? (e.g. Plumber)" 
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Where? (e.g. Chennai)" 
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Search Now</button>
                </form>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="container">
                <div className="providers-grid">
                    {loading ? (
                        <div className="loading-spinner">Searching for top pros...</div>
                    ) : providers.length > 0 ? (
                        providers.map(provider => (
                            <ServiceCard key={provider.id} provider={provider} />
                        ))
                    ) : (
                        <div className="no-results glass">
                            <h3>No results found</h3>
                            <p>Try adjusting your search terms or location.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
