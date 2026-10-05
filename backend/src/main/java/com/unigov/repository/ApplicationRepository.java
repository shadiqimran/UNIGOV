package com.unigov.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    Optional<Application> findByApplicationNumber(
            String applicationNumber
    );

    List<Application> findByCitizenId(Long citizenId);

    List<Application> findByStatus(String status);

    List<Application> findByCitizenIdAndStatus(
            Long citizenId,
            String status
    );
}