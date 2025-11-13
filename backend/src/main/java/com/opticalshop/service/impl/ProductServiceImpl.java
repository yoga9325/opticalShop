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
