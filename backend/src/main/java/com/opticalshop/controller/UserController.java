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
        if (u.isEmpty())
            return ResponseEntity.notFound().build();
        User user = u.get();
        UserDto d = new UserDto();
        d.setId(user.getId());
        d.setUsername(user.getUsername());
        d.setEmail(user.getEmail());
        d.setMobileNumber(user.getMobileNumber());
        d.setFirstName(user.getFirstName());
        d.setLastName(user.getLastName());
        d.setAddress(user.getAddress());
        d.setRoles(user.getRoles());
        return ResponseEntity.ok(d);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody UserDto userDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> u = userRepository.findByUsername(username);
        if (u.isEmpty())
            return ResponseEntity.notFound().build();
        User user = u.get();

        if (userDto.getEmail() != null)
            user.setEmail(userDto.getEmail());
        if (userDto.getMobileNumber() != null)
            user.setMobileNumber(userDto.getMobileNumber());
        if (userDto.getFirstName() != null)
            user.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null)
            user.setLastName(userDto.getLastName());
        if (userDto.getAddress() != null)
            user.setAddress(userDto.getAddress());

        userRepository.save(user);
        return ResponseEntity.ok(userDto);
    }
}
