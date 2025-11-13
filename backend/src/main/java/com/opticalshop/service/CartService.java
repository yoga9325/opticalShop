package com.opticalshop.service;

import com.opticalshop.dto.CartDto;

public interface CartService {
    CartDto getCartForUser(Long userId);
    CartDto addProductToCart(Long userId, Long productId, int quantity);
    CartDto removeProductFromCart(Long userId, Long productId);
}
