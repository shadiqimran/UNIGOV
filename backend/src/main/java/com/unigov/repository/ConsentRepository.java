package com.unigov.repository;

import com.unigov.entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsentRepository extends JpaRepository<Consent, Long> {

    List<Consent> findByCitizenId(Long citizenId);

    List<Consent> findByCitizenIdAndStatus(Long citizenId, String status);

    Optional<Consent> findByCitizenIdAndDepartmentIdAndServiceIdAndStatus(
            Long citizenId,
            Long departmentId,
            Long serviceId,
            String status
    );
}
