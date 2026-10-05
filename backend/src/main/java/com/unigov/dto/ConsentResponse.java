package com.unigov.dto;

import java.time.LocalDateTime;

public record ConsentResponse(
        Long id,
        Long citizenId,
        String departmentName,
        String departmentCode,
        Long serviceId,
        String serviceName,
        String purpose,
        String status,
        LocalDateTime grantedAt,
        LocalDateTime revokedAt
) {
}
