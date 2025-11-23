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

    @Autowired
    private com.opticalshop.service.EmailService emailService;

    @Autowired
    private com.opticalshop.service.SmsService smsService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String mobile = body.get("mobile");

        if ((email == null || email.isEmpty()) && (mobile == null || mobile.isEmpty())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email or Mobile Number is required"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        User user = null;
        if (email != null && !email.isEmpty()) {
            user = userRepository.findByEmail(email).orElse(null);
        } else if (mobile != null && !mobile.isEmpty()) {
            user = userRepository.findByMobileNumber(mobile).orElse(null);
        }

        if (user == null) {
            // Create a new user if not exists (Registration flow)
            user = new User();
            if (email != null) {
                user.setEmail(email);
                user.setUsername(email);
            } else {
                user.setMobileNumber(mobile);
                user.setUsername(mobile);
            }
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString())); // Random password
            user.setRoles(Set.of("ROLE_USER"));
            user.setEnabled(true);
        }

        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10)); // 10 mins expiry
        userRepository.save(user);

        if (email != null && !email.isEmpty()) {
            emailService.sendEmail(email, "Your OTP Code", "Your OTP code is: " + otp);
        } else if (mobile != null && !mobile.isEmpty()) {
            smsService.sendSms(mobile, "Your OTP code is: " + otp);
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String mobile = body.get("mobile");
        String otp = body.get("otp");

        User user = null;
        if (email != null && !email.isEmpty()) {
            user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } else if (mobile != null && !mobile.isEmpty()) {
            user = userRepository.findByMobileNumber(mobile)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Email or Mobile Number is required"));
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
        }

        if (user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP expired"));
        }

        // Clear OTP
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Generate Token
        String token = jwtUtil.generateToken(user.getUsername());
        String user_role = String.join(",", user.getRoles());

        return ResponseEntity.ok(Map.of("token", token, "role", user_role, "username", user.getUsername()));
    }
}
