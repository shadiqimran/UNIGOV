package com.unigov.dto;

import java.time.LocalDateTime;

public record AuditLogResponse(
        Long id,
        Long userId,
        Long applicationId,
        Long departmentId,
        String departmentName,
        String action,
        String resourceType,
        String resourceId,
        String status,
        String details,
        LocalDateTime createdAt
) {
}
