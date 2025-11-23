package com.opticalshop.service;

import com.opticalshop.model.Discount;
import com.opticalshop.model.Product;

import java.util.List;
import java.util.Optional;

public interface DiscountService {
    List<Discount> getAllDiscounts();

    Optional<Discount> getDiscountById(Long id);

    Discount createDiscount(Discount discount);

    Discount updateDiscount(Long id, Discount discount);

    void deleteDiscount(Long id);

    List<Discount> getActiveDiscounts();

    List<Discount> getDiscountsForProduct(Product product);

    Optional<Discount> getDiscountByCode(String code);

    Discount validateCoupon(String code) throws Exception;
}
