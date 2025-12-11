package com.opticalshop.repository;

import com.opticalshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT oi.product FROM OrderItem oi GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
    List<com.opticalshop.model.Product> findTopSellingProducts(org.springframework.data.domain.Pageable pageable);
}