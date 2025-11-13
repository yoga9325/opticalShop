package com.opticalshop.repository;

import com.opticalshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%',:q,'%'))) AND p.active = true")
    Page<Product> search(@Param("q") String q, Pageable pageable);

    Page<Product> findByCategory(String category, Pageable pageable);
    List<Product> findByBrand(String brand);
    List<Product> findByPriceLessThanEqual(Double price);
}