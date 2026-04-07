package com.example.localservice.service;

import com.example.localservice.model.Provider;
import com.example.localservice.model.Review;
import com.example.localservice.repository.ProviderRepository;
import com.example.localservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProviderRepository providerRepository;

    public Review addReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        updateProviderRating(review.getProvider().getId());
        return savedReview;
    }

    public List<Review> getReviewsByProvider(Long providerId) {
        return reviewRepository.findByProviderId(providerId);
    }

    private void updateProviderRating(Long providerId) {
        List<Review> reviews = reviewRepository.findByProviderId(providerId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        Provider provider = providerRepository.findById(providerId).orElse(null);
        if (provider != null) {
            provider.setAverageRating(Math.round(avg * 10.0) / 10.0);
            providerRepository.save(provider);
        }
    }
}
