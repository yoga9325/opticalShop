package com.opticalshop.controller;

import com.opticalshop.model.ProductRating;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;
import com.opticalshop.service.ProductRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class ProductRatingController {

    @Autowired
    private ProductRatingService ratingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> rateProduct(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        Long productId = Long.valueOf(request.get("productId").toString());
        Integer rating = Integer.valueOf(request.get("rating").toString());

        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        try {
            ProductRating savedRating = ratingService.rateProduct(productId, userId, rating);
            return ResponseEntity.ok(savedRating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductRating(@PathVariable Long productId) {
        Map<String, Object> rating = ratingService.getProductRating(productId);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/product/{productId}/user")
    public ResponseEntity<?> getUserRating(
            @PathVariable Long productId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        Long userId = getUserIdFromAuthentication(authentication);
        if (userId == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<ProductRating> rating = ratingService.getUserRatingForProduct(productId, userId);

        if (rating.isPresent()) {
            return ResponseEntity.ok(rating.get());
        } else {
            return ResponseEntity.ok(Map.of("rating", 0));
        }
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(User::getId).orElse(null);
    }
}
