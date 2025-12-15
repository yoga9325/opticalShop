package com.opticalshop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_ratings", uniqueConstraints = @UniqueConstraint(columnNames = { "product_id", "user_id" }))
public class ProductRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "review_message", columnDefinition = "TEXT")
    private String reviewMessage;

    @OneToMany(mappedBy = "productRating", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<RatingImage> ratingImages = new java.util.ArrayList<>();

    // ... (rest of the file)

    // Helper method to add image
    public void addImage(RatingImage image) {
        ratingImages.add(image);
        image.setProductRating(this);
    }
    
    public void removeImage(RatingImage image) {
        ratingImages.remove(image);
        image.setProductRating(null);
    }

    public java.util.List<RatingImage> getRatingImages() {
        return ratingImages;
    }

    public void setRatingImages(java.util.List<RatingImage> ratingImages) {
        this.ratingImages = ratingImages;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public ProductRating() {
    }

    public ProductRating(Long productId, Long userId, Integer rating) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getReviewMessage() {
        return reviewMessage;
    }

    public void setReviewMessage(String reviewMessage) {
        this.reviewMessage = reviewMessage;
    }


}
