package com.unigov.service;

import com.unigov.entity.WorkflowDefinition;
import com.unigov.entity.WorkflowStep;
import com.unigov.repository.WorkflowDefinitionRepository;
import com.unigov.repository.WorkflowStepRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkflowService {

    private final WorkflowDefinitionRepository workflowDefinitionRepository;
    private final WorkflowStepRepository workflowStepRepository;

    public WorkflowService(
            WorkflowDefinitionRepository workflowDefinitionRepository,
            WorkflowStepRepository workflowStepRepository) {
        this.workflowDefinitionRepository = workflowDefinitionRepository;
        this.workflowStepRepository = workflowStepRepository;
    }

    public List<WorkflowDefinition> getAllWorkflows() {
        return workflowDefinitionRepository.findAll();
    }

    public Optional<WorkflowDefinition> getWorkflowById(Long id) {
        return workflowDefinitionRepository.findById(id);
    }

    public List<WorkflowDefinition> getWorkflowsByService(Long serviceId) {
        return workflowDefinitionRepository.findByServiceId(serviceId);
    }

    public Optional<WorkflowDefinition> getWorkflowVersion(
            Long serviceId,
            Integer version) {
        return workflowDefinitionRepository
                .findByServiceIdAndVersion(serviceId, version);
    }

    public List<WorkflowStep> getWorkflowSteps(Long workflowId) {
        return workflowStepRepository
                .findByWorkflowIdOrderByStepOrder(workflowId);
    }

    public Optional<WorkflowStep> getWorkflowStep(
            Long workflowId,
            Integer stepOrder) {
        return workflowStepRepository
                .findByWorkflowIdAndStepOrder(workflowId, stepOrder);
    }
}
