package com.unigov.service;

import com.unigov.entity.Consent;
import com.unigov.entity.Department;
import com.unigov.entity.Service;
import com.unigov.entity.User;
import com.unigov.exception.ResourceNotFoundException;
import com.unigov.repository.ConsentRepository;
import com.unigov.repository.DepartmentRepository;
import com.unigov.repository.ServiceRepository;
import com.unigov.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ConsentService {

    private final ConsentRepository consentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ServiceRepository serviceRepository;

    public ConsentService(
            ConsentRepository consentRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            ServiceRepository serviceRepository) {
        this.consentRepository = consentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<Consent> getCitizenConsents(Long citizenId) {
        return consentRepository.findByCitizenId(citizenId);
    }

    public List<Consent> getActiveConsents(Long citizenId) {
        return consentRepository.findByCitizenIdAndStatus(citizenId, "GRANTED");
    }

    @Transactional
    public Consent grantConsent(
            Long citizenId,
            Long departmentId,
            Long serviceId,
            String purpose) {

        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Citizen not found with id: " + citizenId));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + departmentId));

        Service service = null;

        if (serviceId != null) {
            service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Service not found with id: " + serviceId));
        }

        Consent consent = new Consent();
        consent.setCitizen(citizen);
        consent.setDepartment(department);
        consent.setService(service);
        consent.setPurpose(purpose);
        consent.setStatus("GRANTED");

        return consentRepository.save(consent);
    }

    @Transactional
    public Consent revokeConsent(Long consentId, Long citizenId) {

        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consent not found with id: " + consentId));

        if (!consent.getCitizen().getId().equals(citizenId)) {
            throw new IllegalArgumentException(
                    "You are not authorized to revoke this consent");
        }

        consent.setStatus("REVOKED");
        consent.setRevokedAt(java.time.LocalDateTime.now());

        return consentRepository.save(consent);
    }

    public boolean hasActiveConsent(
            Long citizenId,
            Long departmentId,
            Long serviceId) {

        return consentRepository
                .findByCitizenIdAndDepartmentIdAndServiceIdAndStatus(
                        citizenId,
                        departmentId,
                        serviceId,
                        "GRANTED")
                .isPresent();
    }
}
