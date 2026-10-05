package com.unigov.service;

import com.unigov.dto.ApplicationCreateRequest;
import com.unigov.dto.ApplicationCreateResponse;
import com.unigov.entity.Application;
import com.unigov.entity.ApplicationStep;
import com.unigov.entity.Service;
import com.unigov.entity.User;
import com.unigov.entity.WorkflowDefinition;
import com.unigov.entity.WorkflowStep;
import com.unigov.exception.ResourceNotFoundException;
import com.unigov.repository.ApplicationRepository;
import com.unigov.repository.ApplicationStepRepository;
import com.unigov.repository.ServiceRepository;
import com.unigov.repository.UserRepository;
import com.unigov.repository.WorkflowDefinitionRepository;
import com.unigov.repository.WorkflowStepRepository;
import com.unigov.workflow.ApplicationNumberGenerator;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStepRepository applicationStepRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final WorkflowDefinitionRepository workflowDefinitionRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final ApplicationNumberGenerator applicationNumberGenerator;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ApplicationStepRepository applicationStepRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository,
            WorkflowDefinitionRepository workflowDefinitionRepository,
            WorkflowStepRepository workflowStepRepository,
            ApplicationNumberGenerator applicationNumberGenerator
    ) {
        this.applicationRepository = applicationRepository;
        this.applicationStepRepository = applicationStepRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.workflowDefinitionRepository = workflowDefinitionRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.applicationNumberGenerator = applicationNumberGenerator;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id
                        )
                );
    }

    public Application getByApplicationNumber(String applicationNumber) {
        return applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found: " + applicationNumber
                        )
                );
    }

    public List<Application> getApplicationsByCitizen(Long citizenId) {
        return applicationRepository.findByCitizenId(citizenId);
    }

    public List<Application> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                )
                .getId();
    }


    public List<Application> getCitizenApplicationsByStatus(
            Long citizenId,
            String status
    ) {
        return applicationRepository.findByCitizenIdAndStatus(
                citizenId,
                status
        );
    }

    @Transactional
    public ApplicationCreateResponse createApplication(
            Long citizenId,
            ApplicationCreateRequest request
    ) {

        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Citizen not found with id: " + citizenId
                        )
                );

        Service service = serviceRepository.findByCode(
                request.serviceCode()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Service not found: " + request.serviceCode()
                )
        );

        WorkflowDefinition workflow =
                workflowDefinitionRepository
                        .findByServiceId(service.getId())
                        .stream()
                        .filter(w -> "ACTIVE".equals(w.getStatus()))
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Active workflow not found for service: "
                                                + service.getCode()
                                )
                        );

        Application application = new Application();

        application.setApplicationNumber(
                applicationNumberGenerator.generate()
        );
        application.setCitizen(citizen);
        application.setService(service);
        application.setWorkflow(workflow);
        application.setStatus("SUBMITTED");
        application.setCurrentStepOrder(1);

        Application savedApplication =
                applicationRepository.save(application);

        List<WorkflowStep> workflowSteps =
                workflowStepRepository.findByWorkflowIdOrderByStepOrder(
                        workflow.getId()
                );

        for (WorkflowStep workflowStep : workflowSteps) {

            ApplicationStep applicationStep =
                    new ApplicationStep();

            applicationStep.setApplication(savedApplication);
            applicationStep.setWorkflowStep(workflowStep);
            applicationStep.setStepOrder(
                    workflowStep.getStepOrder()
            );
            applicationStep.setStatus("PENDING");
            applicationStep.setRetryCount(0);

            applicationStepRepository.save(applicationStep);
        }

        return new ApplicationCreateResponse(
                savedApplication.getId(),
                savedApplication.getApplicationNumber(),
                service.getName(),
                workflow.getName(),
                savedApplication.getStatus(),
                savedApplication.getCurrentStepOrder(),
                "Application created successfully"
        );
    }

    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }
}
