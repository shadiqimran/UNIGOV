package com.unigov.integration.model;

public record VerificationResult(
        boolean verified,
        String department,
        String referenceId,
        String message
) {
}
