package com.opticalshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "promo_banner_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoBannerSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String subtitle;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String features; // Stored as JSON string
    
    @Column(nullable = false)
    private Integer countdownDuration = 15;
    
    @Column(nullable = false, length = 50)
    private String icon = "bi-phone-fill";
}
