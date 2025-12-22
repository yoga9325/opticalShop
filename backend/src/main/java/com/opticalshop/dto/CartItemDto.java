package com.opticalshop.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double price;
    private String imageUrl;
    
    private Long lensId;
    private String lensName;
    private Double lensPrice;

    private Long lensCoatingId;
    private String lensCoatingName;
    private Double lensCoatingPrice;
}
