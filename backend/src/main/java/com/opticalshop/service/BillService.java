package com.opticalshop.service;

import com.opticalshop.model.Bill;
import com.opticalshop.model.BillItem;
import com.opticalshop.model.Product;
import com.opticalshop.model.User;
import com.opticalshop.repository.BillRepository;
import com.opticalshop.repository.ProductRepository;
import com.opticalshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Bill createBill(Bill bill) {
        bill.setBillDate(LocalDateTime.now());

        // Link registered user if username provided
        if (bill.getUser() != null && bill.getUser().getUsername() != null) {
            User user = userRepository.findByUsername(bill.getUser().getUsername()).orElse(null);
            bill.setUser(user);
        }

        // Process items
        if (bill.getBillItems() != null) {
            for (BillItem item : bill.getBillItems()) {
                item.setBill(bill);
                if (item.getProduct() != null && item.getProduct().getId() != null) {
                    Product product = productRepository.findById(item.getProduct().getId()).orElse(null);
                    item.setProduct(product);
                    // Optional: Deduct inventory here if needed
                }
            }
        }

        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAllByOrderByBillDateDesc();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElse(null);
    }
}
