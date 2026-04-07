package com.example.localservice.repository;

import com.example.localservice.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderId(Long providerId);
}
