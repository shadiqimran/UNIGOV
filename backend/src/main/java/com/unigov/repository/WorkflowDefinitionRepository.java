package com.unigov.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.WorkflowDefinition;

public interface WorkflowDefinitionRepository
        extends JpaRepository<WorkflowDefinition, Long> {

    List<WorkflowDefinition> findByServiceId(Long serviceId);

    Optional<WorkflowDefinition> findByServiceIdAndVersion(
            Long serviceId,
            Integer version
    );

    List<WorkflowDefinition> findByStatus(String status);
}