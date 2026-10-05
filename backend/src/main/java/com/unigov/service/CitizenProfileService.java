package com.unigov.service;

import com.unigov.entity.CitizenProfile;
import com.unigov.repository.CitizenProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CitizenProfileService {

    private final CitizenProfileRepository citizenProfileRepository;

    public CitizenProfileService(CitizenProfileRepository citizenProfileRepository) {
        this.citizenProfileRepository = citizenProfileRepository;
    }

    public Optional<CitizenProfile> getByUserId(Long userId) {
        return citizenProfileRepository.findByUserId(userId);
    }

    public CitizenProfile saveProfile(CitizenProfile profile) {
        return citizenProfileRepository.save(profile);
    }

    public boolean existsByUserId(Long userId) {
        return citizenProfileRepository.existsByUserId(userId);
    }
}
