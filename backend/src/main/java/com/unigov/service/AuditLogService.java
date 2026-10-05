package com.unigov.service;

import com.unigov.entity.AuditLog;
import com.unigov.entity.Application;
import com.unigov.entity.Department;
import com.unigov.entity.User;
import com.unigov.repository.AuditLogRepository;
import com.unigov.repository.ApplicationRepository;
import com.unigov.repository.DepartmentRepository;
import com.unigov.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final DepartmentRepository departmentRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            DepartmentRepository departmentRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public AuditLog log(
            Long userId,
            Long applicationId,
            Long departmentId,
            String action,
            String resourceType,
            String resourceId,
            String status,
            String details) {

        AuditLog auditLog = new AuditLog();

        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            auditLog.setUser(user);
        }

        if (applicationId != null) {
            Application application =
                    applicationRepository.findById(applicationId).orElse(null);
            auditLog.setApplication(application);
        }

        if (departmentId != null) {
            Department department =
                    departmentRepository.findById(departmentId).orElse(null);
            auditLog.setDepartment(department);
        }

        auditLog.setAction(action);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setStatus(status);
        auditLog.setDetails(details);

        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getUserLogs(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AuditLog> getApplicationLogs(Long applicationId) {
        return auditLogRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId);
    }

    public List<AuditLog> getDepartmentLogs(Long departmentId) {
        return auditLogRepository.findByDepartmentIdOrderByCreatedAtDesc(departmentId);
    }
}
