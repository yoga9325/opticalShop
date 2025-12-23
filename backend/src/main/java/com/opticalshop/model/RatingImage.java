package com.opticalshop.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rating_images")
public class RatingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rating_id", nullable = false)
    @JsonIgnore
    private ProductRating productRating;

    @Lob
    private byte[] picByte;

    // Constructors
    public RatingImage() {}

    public RatingImage(ProductRating productRating, byte[] picByte) {
        this.productRating = productRating;
        this.picByte = picByte;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductRating getProductRating() { return productRating; }
    public void setProductRating(ProductRating productRating) { this.productRating = productRating; }

    public byte[] getPicByte() { return picByte; }
    public void setPicByte(byte[] picByte) { this.picByte = picByte; }
}
