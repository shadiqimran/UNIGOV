package com.unigov.controller;

import com.unigov.dto.WorkflowResponse;
import com.unigov.dto.WorkflowStepResponse;
import com.unigov.entity.WorkflowDefinition;
import com.unigov.entity.WorkflowStep;
import com.unigov.service.WorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public List<WorkflowResponse> getAllWorkflows() {
        return workflowService.getAllWorkflows()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowResponse> getWorkflow(
            @PathVariable Long id) {

        return workflowService.getWorkflowById(id)
                .map(workflow -> ResponseEntity.ok(toResponse(workflow)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/service/{serviceId}")
    public List<WorkflowResponse> getWorkflowsByService(
            @PathVariable Long serviceId) {

        return workflowService.getWorkflowsByService(serviceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private WorkflowResponse toResponse(WorkflowDefinition workflow) {

        List<WorkflowStepResponse> steps =
                workflowService.getWorkflowSteps(workflow.getId())
                        .stream()
                        .map(this::toStepResponse)
                        .toList();

        return new WorkflowResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getVersion(),
                workflow.getService() != null
                        ? workflow.getService().getName()
                        : null,
                workflow.getStatus(),
                steps
        );
    }

    private WorkflowStepResponse toStepResponse(WorkflowStep step) {
        return new WorkflowStepResponse(
                step.getId(),
                step.getStepOrder(),
                step.getName(),
                step.getCode(),
                step.getDepartment() != null
                        ? step.getDepartment().getName()
                        : null,
                step.getIntegrationRequired(),
                step.getTimeoutSeconds(),
                step.getRetryLimit()
        );
    }
}
