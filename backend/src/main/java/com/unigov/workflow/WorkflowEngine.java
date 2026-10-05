package com.unigov.workflow;

import com.unigov.entity.Application;
import com.unigov.entity.ApplicationStep;
import com.unigov.entity.WorkflowStep;
import com.unigov.integration.adapter.EducationConnector;
import com.unigov.integration.adapter.IdentityConnector;
import com.unigov.integration.adapter.RevenueConnector;
import com.unigov.integration.model.VerificationResult;
import com.unigov.repository.ApplicationStepRepository;
import com.unigov.repository.WorkflowStepRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkflowEngine {

    private final ApplicationStepRepository applicationStepRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final IdentityConnector identityConnector;
    private final RevenueConnector revenueConnector;
    private final EducationConnector educationConnector;

    public WorkflowEngine(
            ApplicationStepRepository applicationStepRepository,
            WorkflowStepRepository workflowStepRepository,
            IdentityConnector identityConnector,
            RevenueConnector revenueConnector,
            EducationConnector educationConnector
    ) {
        this.applicationStepRepository = applicationStepRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.identityConnector = identityConnector;
        this.revenueConnector = revenueConnector;
        this.educationConnector = educationConnector;
    }

    @Transactional
    public WorkflowExecutionResult execute(Application application) {

        List<WorkflowStep> workflowSteps =
                workflowStepRepository.findByWorkflowIdOrderByStepOrder(
                        application.getWorkflow().getId()
                );

        if (workflowSteps.isEmpty()) {
            application.setStatus("FAILED");

            return result(
                    application,
                    "FAILED",
                    "No workflow steps configured"
            );
        }

        for (WorkflowStep workflowStep : workflowSteps) {

            ApplicationStep applicationStep =
                    applicationStepRepository
                            .findByApplicationIdAndStepOrder(
                                    application.getId(),
                                    workflowStep.getStepOrder()
                            )
                            .orElseGet(() -> createApplicationStep(
                                    application,
                                    workflowStep
                            ));

            if ("COMPLETED".equals(applicationStep.getStatus())) {
                application.setCurrentStepOrder(
                        workflowStep.getStepOrder()
                );
                continue;
            }

            application.setCurrentStepOrder(
                    workflowStep.getStepOrder()
            );

            int maximumAttempts =
                    workflowStep.getRetryLimit() + 1;

            VerificationResult verificationResult = null;
            Exception lastException = null;

            for (int attempt = 1; attempt <= maximumAttempts; attempt++) {

                applicationStep.setStatus("IN_PROGRESS");
                applicationStep.setStartedAt(LocalDateTime.now());
                applicationStep.setErrorMessage(null);

                applicationStepRepository.save(applicationStep);

                try {

                    verificationResult =
                            executeStep(
                                    application,
                                    workflowStep
                            );

                    if (verificationResult.verified()) {

                        applicationStep.setStatus("COMPLETED");
                        applicationStep.setCompletedAt(
                                LocalDateTime.now()
                        );
                        applicationStep.setErrorMessage(null);

                        applicationStepRepository.save(
                                applicationStep
                        );

                        break;
                    }

                    applicationStep.setErrorMessage(
                            verificationResult.message()
                    );

                } catch (Exception exception) {

                    lastException = exception;

                    applicationStep.setErrorMessage(
                            exception.getMessage()
                    );
                }

                if (attempt < maximumAttempts) {

                    applicationStep.setRetryCount(
                            applicationStep.getRetryCount() + 1
                    );

                    applicationStepRepository.save(
                            applicationStep
                    );
                }
            }

            if (!"COMPLETED".equals(applicationStep.getStatus())) {

                applicationStep.setStatus("FAILED");
                applicationStep.setCompletedAt(
                        LocalDateTime.now()
                );

                if (lastException != null) {
                    applicationStep.setErrorMessage(
                            "Integration failed after "
                                    + maximumAttempts
                                    + " attempts: "
                                    + lastException.getMessage()
                    );
                }

                applicationStepRepository.save(
                        applicationStep
                );

                application.setStatus("FAILED");

                return result(
                        application,
                        "FAILED",
                        "Workflow step failed after "
                                + maximumAttempts
                                + " attempts: "
                                + workflowStep.getName()
                );
            }
        }

        application.setStatus("COMPLETED");
        application.setCompletedAt(LocalDateTime.now());

        return result(
                application,
                "COMPLETED",
                "All workflow steps completed successfully"
        );
    }

    private VerificationResult executeStep(
            Application application,
            WorkflowStep workflowStep
    ) {

        if (!workflowStep.getIntegrationRequired()) {

            return new VerificationResult(
                    true,
                    workflowStep.getName(),
                    "INTERNAL-" + workflowStep.getStepOrder(),
                    "Internal workflow step completed"
            );
        }

        String citizenId =
                String.valueOf(
                        application.getCitizen().getId()
                );

        return switch (workflowStep.getCode()) {

            case "IDENTITY_VERIFICATION" ->
                    identityConnector.verify(citizenId);

            case "INCOME_VERIFICATION" ->
                    revenueConnector.verify(citizenId);

            case "EDUCATION_VERIFICATION" ->
                    educationConnector.verify(citizenId);

            default ->
                    new VerificationResult(
                            false,
                            workflowStep.getName(),
                            null,
                            "No connector configured for workflow step: "
                                    + workflowStep.getCode()
                    );
        };
    }

    private ApplicationStep createApplicationStep(
            Application application,
            WorkflowStep workflowStep
    ) {

        ApplicationStep applicationStep =
                new ApplicationStep();

        applicationStep.setApplication(application);
        applicationStep.setWorkflowStep(workflowStep);
        applicationStep.setStepOrder(
                workflowStep.getStepOrder()
        );
        applicationStep.setStatus("PENDING");
        applicationStep.setRetryCount(0);

        return applicationStepRepository.save(
                applicationStep
        );
    }

    private WorkflowExecutionResult result(
            Application application,
            String status,
            String message
    ) {

        return new WorkflowExecutionResult(
                application.getId(),
                application.getApplicationNumber(),
                status,
                application.getCurrentStepOrder(),
                message
        );
    }
}
