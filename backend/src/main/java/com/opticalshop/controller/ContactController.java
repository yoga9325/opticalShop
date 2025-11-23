package com.opticalshop.controller;

import com.opticalshop.model.ContactMessage;
import com.opticalshop.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@RequestBody ContactMessage message) {
        contactMessageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }

    @GetMapping("/admin/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        // In a real app, you'd add @PreAuthorize("hasRole('ADMIN')") here
        // Assuming security config handles /api/admin/** protection or it's open for
        // this demo
        List<ContactMessage> messages = contactMessageRepository.findAll(org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(messages);
    }
}
