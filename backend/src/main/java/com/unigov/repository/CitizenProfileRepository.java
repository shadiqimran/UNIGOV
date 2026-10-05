package com.unigov.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.CitizenProfile;

public interface CitizenProfileRepository
        extends JpaRepository<CitizenProfile, Long> {

    Optional<CitizenProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}