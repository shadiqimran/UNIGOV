package com.unigov.dto;

public record WorkflowStepResponse(
        Long id,
        Integer stepOrder,
        String name,
        String code,
        String departmentName,
        boolean integrationRequired,
        Integer timeoutSeconds,
        Integer retryLimit
) {
}
