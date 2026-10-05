package com.unigov.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConsentCreateRequest(
        @NotNull Long departmentId,
        Long serviceId,
        @NotBlank String purpose
) {
}
