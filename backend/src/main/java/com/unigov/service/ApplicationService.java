package com.unigov.service;

import com.unigov.entity.Application;
import com.unigov.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Optional<Application> getByApplicationNumber(
            String applicationNumber) {
        return applicationRepository
                .findByApplicationNumber(applicationNumber);
    }

    public List<Application> getApplicationsByCitizen(Long citizenId) {
        return applicationRepository.findByCitizenId(citizenId);
    }

    public List<Application> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    public List<Application> getCitizenApplicationsByStatus(
            Long citizenId,
            String status) {
        return applicationRepository
                .findByCitizenIdAndStatus(citizenId, status);
    }

    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }
}
