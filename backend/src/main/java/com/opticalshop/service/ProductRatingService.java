package com.opticalshop.service;

import com.opticalshop.model.ProductRating;
import com.opticalshop.repository.ProductRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductRatingService {

    @Autowired
    private ProductRatingRepository ratingRepository;

    @Transactional
    public ProductRating rateProduct(Long productId, Long userId, Integer rating, String reviewMessage, java.util.List<String> base64Images) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Optional<ProductRating> existingRating = ratingRepository.findByProductIdAndUserId(productId, userId);
        ProductRating ratingToSave;

        if (existingRating.isPresent()) {
            ratingToSave = existingRating.get();
            ratingToSave.setRating(rating);
            ratingToSave.setReviewMessage(reviewMessage);
            ratingToSave.getRatingImages().clear(); // Clear old images
        } else {
            ratingToSave = new ProductRating(productId, userId, rating);
            ratingToSave.setReviewMessage(reviewMessage);
        }

        // Process Images
        if (base64Images != null && !base64Images.isEmpty()) {
            for (String base64 : base64Images) {
                try {
                    // Remove header if present (e.g., "data:image/png;base64,")
                    String cleanBase64 = base64;
                    if (base64.contains(",")) {
                        cleanBase64 = base64.split(",")[1];
                    }
                    byte[] imageBytes = java.util.Base64.getDecoder().decode(cleanBase64);
                    
                    com.opticalshop.model.RatingImage image = new com.opticalshop.model.RatingImage(ratingToSave, imageBytes);
                    ratingToSave.addImage(image);
                } catch (Exception e) {
                    System.err.println("Failed to decode image: " + e.getMessage());
                }
            }
        }

        return ratingRepository.save(ratingToSave);
    }

    public java.util.List<ProductRating> getReviewsForProduct(Long productId) {
        return ratingRepository.findByProductId(productId);
    }

    public Map<String, Object> getProductRating(Long productId) {
        Double avgRating = ratingRepository.getAverageRatingByProductId(productId);
        Long count = ratingRepository.countByProductId(productId);

        Map<String, Object> result = new HashMap<>();
        result.put("averageRating", avgRating != null ? avgRating : 0.0);
        result.put("ratingCount", count);

        return result;
    }

    public Optional<ProductRating> getUserRatingForProduct(Long productId, Long userId) {
        return ratingRepository.findByProductIdAndUserId(productId, userId);
    }
}
