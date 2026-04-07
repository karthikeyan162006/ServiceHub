import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ provider }) => {
    const navigate = useNavigate();

    return (
        <div className="card glass animate-fade-in">
            <div className="card-header">
                <div className="pro-info">
                    <h3>{provider.name}</h3>
                    <p className="pro-type">{provider.serviceType.toUpperCase()}</p>
                </div>
                <div className="pro-rating">
                    {provider.averageRating > 0 ? `⭐ ${provider.averageRating}` : 'NEW'}
                </div>
            </div>
            <div className="card-body">
                <div className="info-row">
                    <span>📍</span> {provider.location}
                </div>
                <div className="info-row">
                    <span>💼</span> {provider.experience} Years Experience
                </div>
                <p className="pro-description">
                    Professional {provider.serviceType} providing high-quality service in {provider.location}.
                </p>
            </div>
            <div className="card-footer">
                <button 
                    className="btn-primary" 
                    onClick={() => navigate(`/booking/${provider.id}`)}
                    style={{ width: '100%' }}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
