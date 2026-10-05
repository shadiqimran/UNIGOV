package com.unigov.dto;

import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        String applicationNumber,
        Long citizenId,
        String serviceName,
        String status,
        Integer currentStepOrder,
        LocalDateTime submittedAt,
        LocalDateTime completedAt
) {
}
