package com.unigov.repository;

import com.unigov.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<AuditLog> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);

    List<AuditLog> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
