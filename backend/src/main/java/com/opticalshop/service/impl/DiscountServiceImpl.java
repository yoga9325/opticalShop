package com.opticalshop.service.impl;

import com.opticalshop.model.Discount;
import com.opticalshop.model.Product;
import com.opticalshop.repository.DiscountRepository;
import com.opticalshop.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    public Optional<Discount> getDiscountById(Long id) {
        return discountRepository.findById(id);
    }

    @Override
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    @Override
    public Discount updateDiscount(Long id, Discount discount) {
        discount.setId(id);
        return discountRepository.save(discount);
    }

    @Override
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }

    @Override
    public List<Discount> getActiveDiscounts() {
        return discountRepository.findActiveDiscounts(LocalDateTime.now());
    }

    @Override
    public List<Discount> getDiscountsForProduct(Product product) {
        return discountRepository.findActiveDiscountsForProduct(product, LocalDateTime.now());
    }

    @Override
    public Optional<Discount> getDiscountByCode(String code) {
        return discountRepository.findByCodeAndActiveTrue(code);
    }

    @Override
    public Discount validateCoupon(String code) throws Exception {
        // Find discount by code
        Optional<Discount> discountOpt = discountRepository.findByCodeAndActiveTrue(code);

        if (discountOpt.isEmpty()) {
            throw new Exception("Invalid coupon code");
        }

        Discount discount = discountOpt.get();
        LocalDateTime now = LocalDateTime.now();

        // Check if discount is active
        if (!discount.isActive()) {
            throw new Exception("This coupon is no longer active");
        }

        // Check if discount has started
        if (discount.getStartDate() != null && now.isBefore(discount.getStartDate())) {
            throw new Exception("This coupon is not yet valid");
        }

        // Check if discount has expired
        if (discount.getEndDate() != null && now.isAfter(discount.getEndDate())) {
            throw new Exception("This coupon has expired");
        }

        return discount;
    }
}
