package com.unigov.integration.model;

public record IdentityVerificationRequest(
        String name,
        String phone
) {
}
