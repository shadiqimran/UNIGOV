package com.unigov.dto;

import java.time.LocalDateTime;

public record ApplicationStepResponse(
        Long id,
        Integer stepOrder,
        String stepName,
        String status,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        String errorMessage,
        Integer retryCount
) {
}
