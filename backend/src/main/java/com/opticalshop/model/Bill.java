package com.opticalshop.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bills")
@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerMobile;

    private String customerEmail;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Optional link to registered user

    private LocalDateTime billDate;

    private BigDecimal totalAmount;

    private String paymentMode; // CASH, CARD, UPI

    private String promoCode;

    private String paymentDetails; // Transaction ID for UPI, Last 4 digits for Card

    @com.fasterxml.jackson.annotation.JsonManagedReference
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<BillItem> billItems;
}
