package com.opticalshop.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO for login requests so OpenAPI/Swagger shows a concrete schema.
 */
public final class LoginRequest {

    @Schema(description = "The user's username or login id", example = "johndoe")
    private String username;

    @Schema(description = "The user's password", example = "P@ssw0rd")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}