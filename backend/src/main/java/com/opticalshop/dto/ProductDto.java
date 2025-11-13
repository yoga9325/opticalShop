package com.opticalshop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String brand;
    private String category;
    private BigDecimal price;
    private String imageUrl;
}
