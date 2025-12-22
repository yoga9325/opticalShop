package com.opticalshop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "low_stock_alerts")
public class LowStockAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer currentStock;
    
    @Column(nullable = false)
    private Integer threshold;
    
    @Column(nullable = false)
    private LocalDateTime alertDate;
    
    @Column(nullable = false)
    private Boolean resolved = false;
    
    private LocalDateTime resolvedDate;
    
    @PrePersist
    protected void onCreate() {
        alertDate = LocalDateTime.now();
    }
    
    // Constructors
    public LowStockAlert() {}
    
    public LowStockAlert(Product product, Integer currentStock, Integer threshold) {
        this.product = product;
        this.currentStock = currentStock;
        this.threshold = threshold;
        this.resolved = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public Integer getCurrentStock() {
        return currentStock;
    }
    
    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }
    
    public Integer getThreshold() {
        return threshold;
    }
    
    public void setThreshold(Integer threshold) {
        this.threshold = threshold;
    }
    
    public LocalDateTime getAlertDate() {
        return alertDate;
    }
    
    public void setAlertDate(LocalDateTime alertDate) {
        this.alertDate = alertDate;
    }
    
    public Boolean getResolved() {
        return resolved;
    }
    
    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }
    
    public LocalDateTime getResolvedDate() {
        return resolvedDate;
    }
    
    public void setResolvedDate(LocalDateTime resolvedDate) {
        this.resolvedDate = resolvedDate;
    }
}
