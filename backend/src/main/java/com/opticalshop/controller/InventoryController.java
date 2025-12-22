package com.opticalshop.controller;

import com.opticalshop.model.LowStockAlert;
import com.opticalshop.model.Product;
import com.opticalshop.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    /**
     * Get all active (unresolved) alerts
     */
    @GetMapping("/alerts")
    public ResponseEntity<List<LowStockAlert>> getActiveAlerts() {
        try {
            List<LowStockAlert> alerts = inventoryService.getActiveAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get count of active alerts
     */
    @GetMapping("/alerts/count")
    public ResponseEntity<Map<String, Long>> getActiveAlertsCount() {
        try {
            Long count = inventoryService.getActiveAlertsCount();
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Resolve an alert
     */
    @PutMapping("/alerts/{id}/resolve")
    public ResponseEntity<LowStockAlert> resolveAlert(@PathVariable Long id) {
        try {
            LowStockAlert alert = inventoryService.resolveAlert(id);
            return ResponseEntity.ok(alert);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Update product stock quantity
     */
    @PutMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id, 
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer quantity = payload.get("quantity");
            if (quantity == null || quantity < 0) {
                return ResponseEntity.badRequest().build();
            }
            Product product = inventoryService.updateStock(id, quantity);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get products with low stock
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        try {
            List<Product> products = inventoryService.getLowStockProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Update product stock threshold
     */
    @PutMapping("/products/{id}/threshold")
    public ResponseEntity<Product> updateStockThreshold(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer threshold = payload.get("threshold");
            if (threshold == null || threshold < 0) {
                return ResponseEntity.badRequest().build();
            }
            Product product = inventoryService.updateStockThreshold(id, threshold);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Manually trigger stock check (for testing)
     */
    @PostMapping("/check-stock")
    public ResponseEntity<Map<String, String>> manualStockCheck() {
        try {
            inventoryService.checkLowStock();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Stock check completed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
