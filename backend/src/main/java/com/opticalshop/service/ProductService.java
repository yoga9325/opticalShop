package com.opticalshop.service;

import com.opticalshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductService {
    Page<Product> listAll(String q, Pageable pageable);
    Optional<Product> findById(Long id);
    Product create(Product p);
    Product update(Long id, Product p);
    void delete(Long id);
}
