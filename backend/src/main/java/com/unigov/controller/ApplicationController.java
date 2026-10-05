package com.unigov.controller;

import com.unigov.dto.ApplicationCreateRequest;
import com.unigov.dto.ApplicationCreateResponse;
import com.unigov.dto.ApplicationResponse;
import com.unigov.dto.ApplicationStepResponse;
import com.unigov.entity.Application;
import com.unigov.service.ApplicationService;
import com.unigov.service.ApplicationStepService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ApplicationStepService applicationStepService;

    public ApplicationController(
            ApplicationService applicationService,
            ApplicationStepService applicationStepService) {
        this.applicationService = applicationService;
        this.applicationStepService = applicationStepService;
    }

    @PostMapping
    public ResponseEntity<ApplicationCreateResponse> createApplication(
            @RequestBody ApplicationCreateRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Long citizenId = applicationService
                .getUserIdByEmail(email);

        ApplicationCreateResponse response =
                applicationService.createApplication(
                        citizenId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<ApplicationResponse> getAllApplications() {
        return applicationService.getAllApplications()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long id) {

        Application application =
                applicationService.getApplicationById(id);

        return ResponseEntity.ok(toResponse(application));
    }

    @GetMapping("/citizen/{citizenId}")
    public List<ApplicationResponse> getCitizenApplications(
            @PathVariable Long citizenId) {

        return applicationService.getApplicationsByCitizen(citizenId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}/steps")
    public List<ApplicationStepResponse> getApplicationSteps(
            @PathVariable Long id) {

        return applicationStepService.getStepsByApplication(id)
                .stream()
                .map(step -> new ApplicationStepResponse(
                        step.getId(),
                        step.getStepOrder(),
                        step.getWorkflowStep() != null
                                ? step.getWorkflowStep().getName()
                                : null,
                        step.getStatus(),
                        step.getStartedAt(),
                        step.getCompletedAt(),
                        step.getErrorMessage(),
                        step.getRetryCount()
                ))
                .toList();
    }

    @GetMapping("/status/{status}")
    public List<ApplicationResponse> getApplicationsByStatus(
            @PathVariable String status) {

        return applicationService.getApplicationsByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ApplicationResponse toResponse(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getApplicationNumber(),
                application.getCitizen() != null
                        ? application.getCitizen().getId()
                        : null,
                application.getService() != null
                        ? application.getService().getName()
                        : null,
                application.getStatus(),
                application.getCurrentStepOrder(),
                application.getSubmittedAt(),
                application.getCompletedAt()
        );
    }
}
