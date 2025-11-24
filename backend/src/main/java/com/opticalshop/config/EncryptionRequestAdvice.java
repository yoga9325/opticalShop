package com.opticalshop.config;

import com.opticalshop.util.EncryptionUtil;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

import org.springframework.lang.NonNull;

@ControllerAdvice
public class EncryptionRequestAdvice extends RequestBodyAdviceAdapter {

    @Override
    public boolean supports(@NonNull MethodParameter methodParameter, @NonNull Type targetType,
            @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        // return true; // encriyption request disabled for development
        return false;
    }

    @Override
    @NonNull
    public HttpInputMessage beforeBodyRead(@NonNull HttpInputMessage inputMessage, @NonNull MethodParameter parameter,
            @NonNull Type targetType, @NonNull Class<? extends HttpMessageConverter<?>> converterType)
            throws IOException {
        return new DecryptedHttpInputMessage(inputMessage);
    }

    static class DecryptedHttpInputMessage implements HttpInputMessage {
        private final HttpInputMessage inputMessage;
        private final InputStream body;

        public DecryptedHttpInputMessage(HttpInputMessage inputMessage) throws IOException {
            this.inputMessage = inputMessage;
            String encryptedBody = new String(inputMessage.getBody().readAllBytes(), StandardCharsets.UTF_8);
            // If body is empty or not encrypted (e.g. JSON structure), handle gracefully or
            // assume encrypted
            // For this task, we assume all payloads are encrypted strings.
            // However, we should be careful if the body is empty.
            if (encryptedBody == null || encryptedBody.isEmpty()) {
                this.body = new ByteArrayInputStream(new byte[0]);
            } else {
                // Remove quotes if sent as JSON string "..."
                if (encryptedBody.startsWith("\"") && encryptedBody.endsWith("\"")) {
                    encryptedBody = encryptedBody.substring(1, encryptedBody.length() - 1);
                }
                String decryptedBody = EncryptionUtil.decrypt(encryptedBody);
                this.body = new ByteArrayInputStream(decryptedBody.getBytes(StandardCharsets.UTF_8));
            }
        }

        @Override
        @NonNull
        @SuppressWarnings("null")
        public InputStream getBody() throws IOException {
            return body;
        }

        @Override
        @NonNull
        public HttpHeaders getHeaders() {
            return inputMessage.getHeaders();
        }
    }
}
