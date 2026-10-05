package com.unigov.auth;

public record LoginRequest(
        String email,
        String password
) {
}
