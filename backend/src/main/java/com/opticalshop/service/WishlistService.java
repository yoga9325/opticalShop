package com.opticalshop.service;

import com.opticalshop.dto.WishlistDto;

public interface WishlistService {
    WishlistDto getWishlistForUser(Long userId);
    WishlistDto addProductToWishlist(Long userId, Long productId);
    WishlistDto removeProductFromWishlist(Long userId, Long productId);
}
