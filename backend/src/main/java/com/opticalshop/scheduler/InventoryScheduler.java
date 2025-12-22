package com.opticalshop.scheduler;

import com.opticalshop.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class InventoryScheduler {
    
    @Autowired
    private InventoryService inventoryService;
    
    /**
     * Check stock levels every hour
     * Cron expression: 0 0 * * * * = every hour at minute 0
     */
    @Scheduled(cron = "0 0 * * * *")
    public void checkStockLevels() {
        System.out.println("Running scheduled stock check...");
        inventoryService.checkLowStock();
        System.out.println("Stock check completed.");
    }
    
    /**
     * Alternative: Run every hour using fixedRate (in milliseconds)
     * Uncomment to use instead of cron
     */
    // @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 ms
    // public void checkStockLevelsFixed() {
    //     System.out.println("Running scheduled stock check...");
    //     inventoryService.checkLowStock();
    //     System.out.println("Stock check completed.");
    // }
}
