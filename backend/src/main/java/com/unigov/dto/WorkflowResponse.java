package com.unigov.dto;

import java.util.List;

public record WorkflowResponse(
        Long id,
        String name,
        Integer version,
        String serviceName,
        String status,
        List<WorkflowStepResponse> steps
) {
}
