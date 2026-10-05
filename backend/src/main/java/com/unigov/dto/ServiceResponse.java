package com.unigov.dto;

public record ServiceResponse(
        Long id,
        String name,
        String code,
        String description,
        String departmentName,
        String status
) {
}
