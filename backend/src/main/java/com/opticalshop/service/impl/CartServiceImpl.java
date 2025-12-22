package com.opticalshop.service.impl;

import com.opticalshop.dto.CartDto;
import com.opticalshop.dto.CartItemDto;
import com.opticalshop.model.Cart;
import com.opticalshop.model.CartItem;
import com.opticalshop.model.Product;
import com.opticalshop.model.User;
import com.opticalshop.repository.CartRepository;
import com.opticalshop.repository.ProductRepository;
import com.opticalshop.repository.UserRepository;
import com.opticalshop.repository.LensRepository;
import com.opticalshop.repository.LensCoatingRepository;
import com.opticalshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private LensRepository lensRepository;

    @Autowired
    private LensCoatingRepository lensCoatingRepository;

    @Override
    public CartDto getCartForUser(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toDto(cart);
    }

    @Override
    public CartDto addProductToCart(Long userId, Long productId, int quantity, Long lensId, Long coatingId) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) {
           throw new RuntimeException("Quantity must be greater than 0");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        int newQuantity = quantity;
        if (existingItem.isPresent()) {
            newQuantity += existingItem.get().getQuantity();
        }

        if (newQuantity > product.getStockQuantity()) {
            throw new RuntimeException("This Item Out Of Stock (" + product.getStockQuantity() + ")");
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            
            if (lensId != null) {
                newItem.setLens(lensRepository.findById(lensId).orElse(null));
            }
            if (coatingId != null) {
                newItem.setLensCoating(lensCoatingRepository.findById(coatingId).orElse(null));
            }

            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return toDto(cart);
    }

    @Override
    public CartDto removeProductFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
        return toDto(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    private CartDto toDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setItems(cart.getItems().stream().map(this::toDto).collect(Collectors.toSet()));
        return dto;
    }

    private CartItemDto toDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getProduct().getPrice().doubleValue());
        dto.setImageUrl(cartItem.getProduct().getImageUrl());
        
        if (cartItem.getLens() != null) {
            dto.setLensId(cartItem.getLens().getId());
            dto.setLensName(cartItem.getLens().getName());
            dto.setLensPrice(cartItem.getLens().getPrice());
        }

        if (cartItem.getLensCoating() != null) {
            dto.setLensCoatingId(cartItem.getLensCoating().getId());
            dto.setLensCoatingName(cartItem.getLensCoating().getName());
            dto.setLensCoatingPrice(cartItem.getLensCoating().getPrice());
        }

        return dto;
    }
}
