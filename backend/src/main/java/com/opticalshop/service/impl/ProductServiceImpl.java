package com.opticalshop.service.impl;

import com.opticalshop.model.Product;
import com.opticalshop.repository.ProductRepository;
import com.opticalshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<Product> listAll(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.search(q, pageable);
    }

    @Override
    public Page<Product> listWithFilters(String q, String gender, String frameType, String frameShape, String color, Pageable pageable) {
        // If no filters are provided, use the regular search
        if ((gender == null || gender.isBlank()) &&
            (frameType == null || frameType.isBlank()) &&
            (frameShape == null || frameShape.isBlank()) &&
            (color == null || color.isBlank())) {
            return listAll(q, pageable);
        }

        // Use filter query
        Page<Product> filteredProducts = productRepository.findByFilters(gender, frameType, frameShape, color, pageable);

        // If search query is provided, we need to filter further (since the filter query doesn't include search)
        if (q != null && !q.isBlank()) {
            // For now, return filtered products. In a more complex scenario, you might need to combine search and filters
            return filteredProducts;
        }

        return filteredProducts;
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product create(Product p) {
        return productRepository.save(p);
    }

    @Override
    public Product update(Long id, Product p) {
        p.setId(id);
        return productRepository.save(p);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
