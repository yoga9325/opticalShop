package com.opticalshop.service.impl;

import com.opticalshop.service.SmsService;
import org.springframework.stereotype.Service;

@Service
public class MockSmsService implements SmsService {
    @Override
    public void sendSms(String to, String message) {
        System.out.println("========================================");
        System.out.println("MOCK SMS to " + to + ": " + message);
        System.out.println("========================================");
    }
}
