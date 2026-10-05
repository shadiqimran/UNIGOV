package com.unigov.workflow;

import com.unigov.entity.Application;
import com.unigov.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowExecutionController {

    private final WorkflowEngine workflowEngine;
    private final ApplicationService applicationService;

    public WorkflowExecutionController(
            WorkflowEngine workflowEngine,
            ApplicationService applicationService
    ) {
        this.workflowEngine = workflowEngine;
        this.applicationService = applicationService;
    }

    @PostMapping("/applications/{applicationId}/execute")
    public ResponseEntity<WorkflowExecutionResult> executeWorkflow(
            @PathVariable Long applicationId
    ) {

        Application application =
                applicationService.getApplicationById(applicationId);

        WorkflowExecutionResult result =
                workflowEngine.execute(application);

        return ResponseEntity.ok(result);
    }
}
