package com.example.localservice.controller;

import com.example.localservice.model.Review;
import com.example.localservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsByProvider(providerId));
    }
}
