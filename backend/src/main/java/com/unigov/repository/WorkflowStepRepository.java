package com.unigov.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.WorkflowStep;

public interface WorkflowStepRepository
        extends JpaRepository<WorkflowStep, Long> {

    List<WorkflowStep> findByWorkflowIdOrderByStepOrder(Long workflowId);

    Optional<WorkflowStep> findByWorkflowIdAndStepOrder(
            Long workflowId,
            Integer stepOrder
    );

    Optional<WorkflowStep> findByWorkflowIdAndCode(
            Long workflowId,
            String code
    );
}