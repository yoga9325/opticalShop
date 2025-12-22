package com.opticalshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OpticalShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpticalShopApplication.class, args);
    }
}