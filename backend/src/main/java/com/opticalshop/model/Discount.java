package com.opticalshop.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String description;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(precision = 10, scale = 2)
    private BigDecimal fixedAmount;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private boolean global = false; // true for site-wide discounts

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }

    public BigDecimal getFixedAmount() { return fixedAmount; }
    public void setFixedAmount(BigDecimal fixedAmount) { this.fixedAmount = fixedAmount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public boolean isGlobal() { return global; }
    public void setGlobal(boolean global) { this.global = global; }
}
