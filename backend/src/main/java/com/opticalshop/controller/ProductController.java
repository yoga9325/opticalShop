package com.opticalshop.controller;

import com.opticalshop.model.Product;
import com.opticalshop.repository.CartItemRepository;
import com.opticalshop.repository.WishlistRepository;
import com.opticalshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @GetMapping
    public Page<Product> list(@RequestParam(required = false) String q,
                              @RequestParam(required = false) String gender,
                              @RequestParam(required = false) String frameType,
                              @RequestParam(required = false) String frameShape,
                              @RequestParam(required = false) String color,
                              @RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size) {
        Pageable p = PageRequest.of(page, size);
        return productService.listWithFilters(q, gender, frameType, frameShape, color, p);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        return productService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product p) {
        return ResponseEntity.ok(productService.create(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        return ResponseEntity.ok(productService.update(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Check if product is in any cart
        boolean inCart = cartItemRepository.findAll().stream()
                .anyMatch(item -> item.getProduct().getId().equals(id));

        // Check if product is in any wishlist
        boolean inWishlist = wishlistRepository.findAll().stream()
                .anyMatch(wishlist -> wishlist.getProducts().stream()
                        .anyMatch(product -> product.getId().equals(id)));

        if (inCart || inWishlist) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete product: Product is currently in a cart or wishlist");
        }

        productService.delete(id);
        return ResponseEntity.ok().build();
    }
}