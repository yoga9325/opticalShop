package com.opticalshop.controller;

import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;
import com.opticalshop.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.opticalshop.dto.LoginRequest;
import com.opticalshop.dto.RegisterRequest;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest body) {
        String username = body.getUsername();
        String password = body.getPassword();
        String email = body.getEmail();
        // String role = body.getRole(); // Allow role to be specified

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username exists"));
        }

        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setEmail(email);
        // Set ROLE_ADMIN if specified, otherwise ROLE_USER
        u.setRoles(Set.of("ROLE_USER"));
        u.setEnabled(true);
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body) {
        String username = body.getUsername();
        String password = body.getPassword();
        String user_role;
        String usernameApi;
        try {
            // Try to find the user first to debug
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            user_role = String.join(",", user.getRoles());
            usernameApi = user.getUsername();
            System.out.println("Found user: " + user.getUsername());
            System.out.println("User roles: " + user.getRoles());
            System.out.println("User enabled: " + user.isEnabled());

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (AuthenticationException ex) {
            System.out.println("Authentication failed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_credentials", "message", ex.getMessage()));
        }

        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token, "role", user_role, "username", usernameApi));
    }
}
