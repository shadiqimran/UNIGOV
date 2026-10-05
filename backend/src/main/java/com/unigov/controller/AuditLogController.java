package com.unigov.controller;

import com.unigov.dto.AuditLogResponse;
import com.unigov.entity.AuditLog;
import com.unigov.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAllLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllLogs()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getUserLogs(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                auditLogService.getUserLogs(userId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<AuditLogResponse>> getApplicationLogs(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                auditLogService.getApplicationLogs(applicationId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<AuditLogResponse>> getDepartmentLogs(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                auditLogService.getDepartmentLogs(departmentId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    private AuditLogResponse toResponse(AuditLog log) {

        return new AuditLogResponse(
                log.getId(),
                log.getUser() != null ? log.getUser().getId() : null,
                log.getApplication() != null
                        ? log.getApplication().getId()
                        : null,
                log.getDepartment() != null
                        ? log.getDepartment().getId()
                        : null,
                log.getDepartment() != null
                        ? log.getDepartment().getName()
                        : null,
                log.getAction(),
                log.getResourceType(),
                log.getResourceId(),
                log.getStatus(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}
