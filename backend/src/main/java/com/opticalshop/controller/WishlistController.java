package com.opticalshop.controller;

import com.opticalshop.dto.WishlistDto;
import com.opticalshop.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<WishlistDto> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(wishlistService.getWishlistForUser(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistDto> addProductToWishlist(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestParam Long productId) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(wishlistService.addProductToWishlist(user.getId(), productId));
    }

    @PostMapping("/remove")
    public ResponseEntity<WishlistDto> removeProductFromWishlist(@AuthenticationPrincipal UserDetails userDetails,
                                                               @RequestParam Long productId) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(user.getId(), productId));
    }
}
