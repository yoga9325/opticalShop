package com.opticalshop.repository;

import com.opticalshop.model.LowStockAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LowStockAlertRepository extends JpaRepository<LowStockAlert, Long> {
    
    List<LowStockAlert> findByResolvedFalseOrderByAlertDateDesc();
    
    Long countByResolvedFalse();
    
    List<LowStockAlert> findByProductIdAndResolvedFalse(Long productId);
}
