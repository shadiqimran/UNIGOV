package com.unigov.controller;

import com.unigov.dto.ConsentCreateRequest;
import com.unigov.dto.ConsentResponse;
import com.unigov.entity.Consent;
import com.unigov.entity.User;
import com.unigov.exception.ResourceNotFoundException;
import com.unigov.service.AuditLogService;
import com.unigov.service.ConsentService;
import com.unigov.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen/consents")
public class ConsentController {

    private final ConsentService consentService;
    private final UserService userService;
    private final AuditLogService auditLogService;

    public ConsentController(
            ConsentService consentService,
            UserService userService,
            AuditLogService auditLogService) {
        this.consentService = consentService;
        this.userService = userService;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<ConsentResponse>> getMyConsents(
            Authentication authentication) {

        User citizen = userService.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated citizen not found"));

        List<ConsentResponse> response = consentService
                .getCitizenConsents(citizen.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ConsentResponse>> getActiveConsents(
            Authentication authentication) {

        User citizen = userService.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated citizen not found"));

        List<ConsentResponse> response = consentService
                .getActiveConsents(citizen.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ConsentResponse> grantConsent(
            @Valid @RequestBody ConsentCreateRequest request,
            Authentication authentication) {

        User citizen = userService.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated citizen not found"));

        Consent consent = consentService.grantConsent(
                citizen.getId(),
                request.departmentId(),
                request.serviceId(),
                request.purpose()
        );

        auditLogService.log(
                citizen.getId(),
                null,
                consent.getDepartment().getId(),
                "CONSENT_GRANTED",
                "CONSENT",
                String.valueOf(consent.getId()),
                "SUCCESS",
                "Citizen granted consent for: " + consent.getPurpose()
        );

        return ResponseEntity.ok(toResponse(consent));
    }

    @PostMapping("/{consentId}/revoke")
    public ResponseEntity<ConsentResponse> revokeConsent(
            @PathVariable Long consentId,
            Authentication authentication) {

        User citizen = userService.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated citizen not found"));

        Consent consent = consentService.revokeConsent(
                consentId,
                citizen.getId()
        );

        auditLogService.log(
                citizen.getId(),
                null,
                consent.getDepartment().getId(),
                "CONSENT_REVOKED",
                "CONSENT",
                String.valueOf(consent.getId()),
                "SUCCESS",
                "Citizen revoked consent"
        );

        return ResponseEntity.ok(toResponse(consent));
    }

    private ConsentResponse toResponse(Consent consent) {

        return new ConsentResponse(
                consent.getId(),
                consent.getCitizen().getId(),
                consent.getDepartment().getName(),
                consent.getDepartment().getCode(),
                consent.getService() != null
                        ? consent.getService().getId()
                        : null,
                consent.getService() != null
                        ? consent.getService().getName()
                        : null,
                consent.getPurpose(),
                consent.getStatus(),
                consent.getGrantedAt(),
                consent.getRevokedAt()
        );
    }
}
