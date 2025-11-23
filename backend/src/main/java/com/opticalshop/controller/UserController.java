package com.opticalshop.controller;

import com.opticalshop.dto.UserDto;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> u = userRepository.findByUsername(username);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();
        UserDto d = new UserDto();
        d.setId(user.getId());
        d.setUsername(user.getUsername());
        d.setEmail(user.getEmail());
        d.setRoles(user.getRoles());
        return ResponseEntity.ok(d);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody UserDto userDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> u = userRepository.findByUsername(username);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();
        user.setEmail(userDto.getEmail());
        userRepository.save(user);
        return ResponseEntity.ok(userDto);
    }
}
