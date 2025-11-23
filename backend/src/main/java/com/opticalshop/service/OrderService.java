package com.opticalshop.service;

import com.opticalshop.model.Order;
import com.opticalshop.model.User;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getOrdersForUser(Long userId);

    Optional<Order> getOrderById(Long orderId);

    Order createOrder(User user, String shippingAddress, String paymentMethod);

    Order updateOrderStatus(Long orderId, String status);

    List<Order> getAllOrders();

    void cancelOrder(Long orderId);
}
