package com.opticalshop.repository;

import com.opticalshop.model.LowStockAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LowStockAlertRepository extends JpaRepository<LowStockAlert, Long> {
    
    List<LowStockAlert> findByResolvedFalseOrderByAlertDateDesc();
    
    Long countByResolvedFalse();
    
    List<LowStockAlert> findByProductIdAndResolvedFalse(Long productId);
    
    List<LowStockAlert> findByProductIdAndResolvedTrueAndResolvedDateAfter(Long productId, LocalDateTime resolvedDate);
    
    // Batch query methods for optimization
    List<LowStockAlert> findByProductIdInAndResolvedFalse(List<Long> productIds);
    
    List<LowStockAlert> findByProductIdInAndResolvedTrueAndResolvedDateAfter(List<Long> productIds, LocalDateTime resolvedDate);
}
