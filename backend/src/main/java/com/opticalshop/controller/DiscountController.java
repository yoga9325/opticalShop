package com.opticalshop.controller;

import com.opticalshop.model.Discount;
import com.opticalshop.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<Discount> getAllDiscounts() {
        return discountService.getAllDiscounts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discount> getDiscount(@PathVariable Long id) {
        return discountService.getDiscountById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) {
        return ResponseEntity.ok(discountService.createDiscount(discount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody Discount discount) {
        return ResponseEntity.ok(discountService.updateDiscount(id, discount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active")
    public List<Discount> getActiveDiscounts() {
        return discountService.getActiveDiscounts();
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code) {
        try {
            Discount discount = discountService.validateCoupon(code);
            return ResponseEntity.ok(discount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
