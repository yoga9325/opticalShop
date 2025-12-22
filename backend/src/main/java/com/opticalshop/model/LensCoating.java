package com.opticalshop.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lens_coatings")
public class LensCoating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Anti-Glare", "Blue-Cut", "Photochromic"
    private String description;
    private Double price;
    
    private String imageUrl; // Optional icon

    public LensCoating() {}

    public LensCoating(String name, String description, Double price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
