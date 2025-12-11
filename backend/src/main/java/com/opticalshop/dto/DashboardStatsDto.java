package com.opticalshop.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Map<String, Double> salesByCategory; // e.g., "Sunglasses" -> 1500.00
    private Map<String, Double> monthlySales;    // e.g., "JAN-2024" -> 5000.00
    private Map<String, Double> weeklySales;     // e.g., "MON" -> 1200.00
    private java.util.List<com.opticalshop.model.Product> lowStockProducts;
    private Map<String, Long> ordersByStatus;
    private java.util.List<com.opticalshop.model.Product> topSellingProducts;
}
