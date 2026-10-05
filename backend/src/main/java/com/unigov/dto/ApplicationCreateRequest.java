package com.unigov.dto;

import jakarta.validation.constraints.NotBlank;

public record ApplicationCreateRequest(
        @NotBlank String serviceCode
) {
}
