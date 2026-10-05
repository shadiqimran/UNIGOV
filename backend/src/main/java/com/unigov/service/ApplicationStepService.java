package com.unigov.service;

import com.unigov.entity.ApplicationStep;
import com.unigov.repository.ApplicationStepRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationStepService {

    private final ApplicationStepRepository applicationStepRepository;

    public ApplicationStepService(
            ApplicationStepRepository applicationStepRepository) {
        this.applicationStepRepository = applicationStepRepository;
    }

    public List<ApplicationStep> getStepsByApplication(Long applicationId) {
        return applicationStepRepository
                .findByApplicationIdOrderByStepOrder(applicationId);
    }

    public Optional<ApplicationStep> getStep(
            Long applicationId,
            Integer stepOrder) {
        return applicationStepRepository
                .findByApplicationIdAndStepOrder(applicationId, stepOrder);
    }

    public List<ApplicationStep> getStepsByStatus(String status) {
        return applicationStepRepository.findByStatus(status);
    }

    public ApplicationStep saveStep(ApplicationStep applicationStep) {
        return applicationStepRepository.save(applicationStep);
    }
}
