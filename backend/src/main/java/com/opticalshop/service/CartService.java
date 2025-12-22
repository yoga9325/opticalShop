package com.opticalshop.service;

import com.opticalshop.dto.CartDto;

public interface CartService {
    CartDto getCartForUser(Long userId);
    CartDto addProductToCart(Long userId, Long productId, int quantity, Long lensId, Long coatingId);
    CartDto removeProductFromCart(Long userId, Long productId);
}
