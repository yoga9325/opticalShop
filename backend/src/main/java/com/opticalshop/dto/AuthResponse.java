package com.opticalshop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response for successful authentication")
public class AuthResponse {
    
    @Schema(description = "JWT token for authentication", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;
    
    @Schema(description = "Type of token", example = "Bearer")
    private String token_type;
    
    @Schema(description = "Username of the authenticated user", example = "john_doe")
    private String username;
    
    @Schema(description = "Role of the authenticated user", example = "ROLE_USER")
    private String role;
}