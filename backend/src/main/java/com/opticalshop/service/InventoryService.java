package com.opticalshop.service;

import com.opticalshop.model.LowStockAlert;
import com.opticalshop.model.Product;
import com.opticalshop.repository.LowStockAlertRepository;
import com.opticalshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private LowStockAlertRepository lowStockAlertRepository;
    
    /**
     * Check all products for low stock and generate alerts (optimized version)
     */
    @Transactional
    public void checkLowStock() {
        // Only fetch products with low stock (much faster than fetching all products)
        List<Product> lowStockProducts = getLowStockProducts();
        
        if (lowStockProducts.isEmpty()) {
            return; // No low stock products, exit early
        }
        
        // Get all product IDs for batch querying
        List<Long> productIds = lowStockProducts.stream()
            .map(Product::getId)
            .toList();
        
        // Batch load all existing unresolved alerts for these products (single query)
        List<LowStockAlert> existingAlerts = 
            lowStockAlertRepository.findByProductIdInAndResolvedFalse(productIds);
        
        // Batch load recently resolved alerts (single query)
        LocalDateTime oneDayAgo = LocalDateTime.now().minusHours(24);
        List<LowStockAlert> recentlyResolvedAlerts = 
            lowStockAlertRepository.findByProductIdInAndResolvedTrueAndResolvedDateAfter(
                productIds, oneDayAgo);
        
        // Create sets for fast lookup
        Set<Long> productsWithUnresolvedAlerts = existingAlerts.stream()
            .map(alert -> alert.getProduct().getId())
            .collect(Collectors.toSet());
        
        Set<Long> productsWithRecentlyResolvedAlerts = recentlyResolvedAlerts.stream()
            .map(alert -> alert.getProduct().getId())
            .collect(Collectors.toSet());
        
        // Generate alerts only for products that need them
        List<LowStockAlert> newAlerts = new ArrayList<>();
        List<Product> productsToUpdate = new ArrayList<>();
        
        for (Product product : lowStockProducts) {
            Long productId = product.getId();
            
            // Only create alert if no existing unresolved alert and no recently resolved alert
            if (!productsWithUnresolvedAlerts.contains(productId) && 
                !productsWithRecentlyResolvedAlerts.contains(productId)) {
                
                Integer threshold = product.getLowStockThreshold();
                if (threshold == null) {
                    threshold = 5;
                }
                
                LowStockAlert alert = new LowStockAlert(
                    product,
                    product.getStockQuantity(),
                    threshold
                );
                newAlerts.add(alert);
            }
            
            // Update last stock check time
            product.setLastStockCheck(LocalDateTime.now());
            productsToUpdate.add(product);
        }
        
        // Batch save all new alerts (single query)
        if (!newAlerts.isEmpty()) {
            lowStockAlertRepository.saveAll(newAlerts);
        }
        
        // Batch save all product updates (single query)
        if (!productsToUpdate.isEmpty()) {
            productRepository.saveAll(productsToUpdate);
        }
    }
    
    /**
     * Generate a low stock alert for a product
     */
    @Transactional
    public LowStockAlert generateAlert(Product product) {
        Integer threshold = product.getLowStockThreshold();
        // Use default threshold of 5 if not set
        if (threshold == null) {
            threshold = 5;
        }
        
        LowStockAlert alert = new LowStockAlert(
            product,
            product.getStockQuantity(),
            threshold
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
    
    /**
     * Scheduled task to check low stock every hour
     */
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 3600000) // Run every hour (3600000 ms)
    public void scheduledLowStockCheck() {
        checkLowStock();
    }
}
