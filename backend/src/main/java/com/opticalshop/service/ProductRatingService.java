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
    public ProductRating rateProduct(Long productId, Long userId, Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Optional<ProductRating> existingRating = ratingRepository.findByProductIdAndUserId(productId, userId);

        if (existingRating.isPresent()) {
            // Update existing rating
            ProductRating pr = existingRating.get();
            pr.setRating(rating);
            return ratingRepository.save(pr);
        } else {
            // Create new rating
            ProductRating newRating = new ProductRating(productId, userId, rating);
            return ratingRepository.save(newRating);
        }
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
