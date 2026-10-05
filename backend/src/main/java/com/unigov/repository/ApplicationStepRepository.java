package com.unigov.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.ApplicationStep;

public interface ApplicationStepRepository
        extends JpaRepository<ApplicationStep, Long> {

    List<ApplicationStep> findByApplicationIdOrderByStepOrder(
            Long applicationId
    );

    Optional<ApplicationStep> findByApplicationIdAndStepOrder(
            Long applicationId,
            Integer stepOrder
    );

    List<ApplicationStep> findByStatus(String status);
}