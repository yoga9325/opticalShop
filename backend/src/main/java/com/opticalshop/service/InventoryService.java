package com.opticalshop.service;

import com.opticalshop.model.LowStockAlert;
import com.opticalshop.model.Product;
import com.opticalshop.repository.LowStockAlertRepository;
import com.opticalshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private LowStockAlertRepository lowStockAlertRepository;
    
    /**
     * Check all products for low stock and generate alerts
     */
    @Transactional
    public void checkLowStock() {
        List<Product> allProducts = productRepository.findAll();
        
        for (Product product : allProducts) {
            Integer stockQty = product.getStockQuantity();
            Integer threshold = product.getLowStockThreshold();
            
            if (stockQty != null && threshold != null && stockQty <= threshold) {
                
                // Check if there's already an unresolved alert for this product
                List<LowStockAlert> existingAlerts = 
                    lowStockAlertRepository.findByProductIdAndResolvedFalse(product.getId());
                
                if (existingAlerts.isEmpty()) {
                    generateAlert(product);
                }
            }
            
            // Update last stock check time
            product.setLastStockCheck(LocalDateTime.now());
            productRepository.save(product);
        }
    }
    
    /**
     * Generate a low stock alert for a product
     */
    @Transactional
    public LowStockAlert generateAlert(Product product) {
        LowStockAlert alert = new LowStockAlert(
            product,
            product.getStockQuantity(),
            product.getLowStockThreshold()
        );
        return lowStockAlertRepository.save(alert);
    }
    
    /**
     * Get all active (unresolved) alerts
     */
    public List<LowStockAlert> getActiveAlerts() {
        return lowStockAlertRepository.findByResolvedFalseOrderByAlertDateDesc();
    }
    
    /**
     * Get count of active alerts
     */
    public Long getActiveAlertsCount() {
        return lowStockAlertRepository.countByResolvedFalse();
    }
    
    /**
     * Resolve an alert
     */
    @Transactional
    public LowStockAlert resolveAlert(Long alertId) {
        Optional<LowStockAlert> alertOpt = lowStockAlertRepository.findById(alertId);
        if (alertOpt.isPresent()) {
            LowStockAlert alert = alertOpt.get();
            alert.setResolved(true);
            alert.setResolvedDate(LocalDateTime.now());
            return lowStockAlertRepository.save(alert);
        }
        throw new RuntimeException("Alert not found with id: " + alertId);
    }
    
    /**
     * Update product stock quantity
     */
    @Transactional
    public Product updateStock(Long productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStockQuantity(quantity);
            product.setLastStockCheck(LocalDateTime.now());
            
            Product savedProduct = productRepository.save(product);
            
            // Check if stock is now above threshold and resolve alerts
            Integer threshold = product.getLowStockThreshold();
            if (threshold != null && quantity > threshold) {
                List<LowStockAlert> alerts = 
                    lowStockAlertRepository.findByProductIdAndResolvedFalse(productId);
                for (LowStockAlert alert : alerts) {
                    alert.setResolved(true);
                    alert.setResolvedDate(LocalDateTime.now());
                    lowStockAlertRepository.save(alert);
                }
            }
            
            return savedProduct;
        }
        throw new RuntimeException("Product not found with id: " + productId);
    }
    
    /**
     * Get products with low stock
     */
    public List<Product> getLowStockProducts() {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.stream()
            .filter(p -> {
                Integer stockQty = p.getStockQuantity();
                Integer threshold = p.getLowStockThreshold();
                return stockQty != null && threshold != null && stockQty <= threshold;
            })
            .toList();
    }
    
    /**
     * Update product stock threshold
     */
    @Transactional
    public Product updateStockThreshold(Long productId, Integer threshold) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setLowStockThreshold(threshold);
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + productId);
    }
}
