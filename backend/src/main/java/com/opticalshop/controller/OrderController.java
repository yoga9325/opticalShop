package com.opticalshop.controller;

import com.opticalshop.model.Order;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;
import com.opticalshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(orderService.getOrdersForUser(user.getId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersForUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        return orderService.getOrderById(id)
                .filter(order -> order.getUser().getId().equals(user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order orderRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        Order order = orderService.createOrder(user, orderRequest.getShippingAddress(),
                orderRequest.getPaymentMethod());
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {
        String status = payload.get("status");
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        Order order = orderService.getOrderById(id)
                .filter(o -> o.getUser().getId().equals(user.getId()))
                .orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }
}
