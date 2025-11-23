package com.opticalshop.repository;

import com.opticalshop.model.Discount;
import com.opticalshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DiscountRepository extends JpaRepository<Discount, Long> {

    List<Discount> findByActiveTrue();

    List<Discount> findByProduct(Product product);

    List<Discount> findByGlobalTrue();

    @Query("SELECT d FROM Discount d WHERE d.active = true AND d.startDate <= :now AND (d.endDate IS NULL OR d.endDate >= :now)")
    List<Discount> findActiveDiscounts(@Param("now") LocalDateTime now);

    @Query("SELECT d FROM Discount d WHERE d.product = :product AND d.active = true AND d.startDate <= :now AND (d.endDate IS NULL OR d.endDate >= :now)")
    List<Discount> findActiveDiscountsForProduct(@Param("product") Product product, @Param("now") LocalDateTime now);

    Optional<Discount> findByCodeAndActiveTrue(String code);
}
