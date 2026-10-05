package com.unigov.workflow;

public record WorkflowExecutionResult(
        Long applicationId,
        String applicationNumber,
        String status,
        Integer currentStepOrder,
        String message
) {
}
