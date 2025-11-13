package com.opticalshop.controller;

import com.opticalshop.dto.CartDto;
import com.opticalshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(cartService.getCartForUser(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addProductToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestParam Long productId,
                                                    @RequestParam int quantity) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(cartService.addProductToCart(user.getId(), productId, quantity));
    }

    @PostMapping("/remove")
    public ResponseEntity<CartDto> removeProductFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                                         @RequestParam Long productId) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(cartService.removeProductFromCart(user.getId(), productId));
    }
}
