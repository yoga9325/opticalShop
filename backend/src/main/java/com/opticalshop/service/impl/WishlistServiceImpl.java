package com.opticalshop.service.impl;

import com.opticalshop.dto.ProductDto;
import com.opticalshop.dto.WishlistDto;
import com.opticalshop.model.Product;
import com.opticalshop.model.User;
import com.opticalshop.model.Wishlist;
import com.opticalshop.repository.ProductRepository;
import com.opticalshop.repository.UserRepository;
import com.opticalshop.repository.WishlistRepository;
import com.opticalshop.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public WishlistDto getWishlistForUser(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return toDto(wishlist);
    }

    @Override
    public WishlistDto addProductToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        wishlist.getProducts().add(product);
        wishlistRepository.save(wishlist);
        return toDto(wishlist);
    }

    @Override
    public WishlistDto removeProductFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
        wishlistRepository.save(wishlist);
        return toDto(wishlist);
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Wishlist newWishlist = new Wishlist();
            newWishlist.setUser(user);
            return wishlistRepository.save(newWishlist);
        });
    }

    private WishlistDto toDto(Wishlist wishlist) {
        WishlistDto dto = new WishlistDto();
        dto.setId(wishlist.getId());
        dto.setUserId(wishlist.getUser().getId());
        dto.setProducts(wishlist.getProducts().stream().map(this::toDto).collect(Collectors.toSet()));
        return dto;
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBrand(product.getBrand());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }
}
