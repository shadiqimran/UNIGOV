package com.unigov.dto;

public record ApplicationCreateResponse(
        Long applicationId,
        String applicationNumber,
        String serviceName,
        String workflowName,
        String status,
        Integer currentStepOrder,
        String message
) {
}
