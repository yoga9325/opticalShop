package com.opticalshop.service;

import com.opticalshop.dto.RegisterRequest;
import com.opticalshop.model.User;

import java.util.Optional;

public interface UserService {
    User registerUser(RegisterRequest registerRequest);
    Optional<User> findByUsername(String username);
}
