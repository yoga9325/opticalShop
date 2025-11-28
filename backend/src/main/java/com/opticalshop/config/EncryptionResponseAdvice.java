package com.opticalshop.config;

import com.opticalshop.util.EncryptionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class EncryptionResponseAdvice implements ResponseBodyAdvice<Object> {

    private static final Logger logger = LoggerFactory.getLogger(EncryptionResponseAdvice.class);
    private final ObjectMapper objectMapper;

    public EncryptionResponseAdvice(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(@NonNull MethodParameter returnType,
            @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        // return true; // encriyption response disabled for development
        return false;
    }

    @Override
    public Object beforeBodyWrite(@Nullable Object body, @NonNull MethodParameter returnType,
            @NonNull MediaType selectedContentType,
            @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType, @NonNull ServerHttpRequest request,
            @NonNull ServerHttpResponse response) {
        if (body == null) {
            return null;
        }
        // Avoid double encryption or encrypting strings that are already encrypted if
        // that happens
        // But usually body is an object.
        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            return EncryptionUtil.encrypt(jsonBody);
        } catch (Exception e) {
            logger.error("Error encrypting response body", e);
            throw new RuntimeException("Error encrypting response body", e);
        }
    }
}
