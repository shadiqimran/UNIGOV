package com.unigov.dto;

public record DepartmentResponse(
        Long id,
        String name,
        String code,
        String description,
        String status
) {
}
