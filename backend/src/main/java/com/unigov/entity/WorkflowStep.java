package com.unigov.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "workflow_steps",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_workflow_step_order",
            columnNames = {"workflow_id", "step_order"}
        ),
        @UniqueConstraint(
            name = "uq_workflow_step_code",
            columnNames = {"workflow_id", "code"}
        )
    }
)
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workflow_id", nullable = false)
    private WorkflowDefinition workflow;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 50)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "integration_required", nullable = false)
    private Boolean integrationRequired = false;

    @Column(name = "timeout_seconds", nullable = false)
    private Integer timeoutSeconds = 30;

    @Column(name = "retry_limit", nullable = false)
    private Integer retryLimit = 3;

    public WorkflowStep() {
    }

    public WorkflowStep(
            WorkflowDefinition workflow,
            Integer stepOrder,
            String name,
            String code,
            Department department,
            Boolean integrationRequired,
            Integer timeoutSeconds,
            Integer retryLimit
    ) {
        this.workflow = workflow;
        this.stepOrder = stepOrder;
        this.name = name;
        this.code = code;
        this.department = department;
        this.integrationRequired = integrationRequired;
        this.timeoutSeconds = timeoutSeconds;
        this.retryLimit = retryLimit;
    }

    public Long getId() {
        return id;
    }

    public WorkflowDefinition getWorkflow() {
        return workflow;
    }

    public void setWorkflow(WorkflowDefinition workflow) {
        this.workflow = workflow;
    }

    public Integer getStepOrder() {
        return stepOrder;
    }

    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Boolean getIntegrationRequired() {
        return integrationRequired;
    }

    public void setIntegrationRequired(Boolean integrationRequired) {
        this.integrationRequired = integrationRequired;
    }

    public Integer getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(Integer timeoutSeconds) {
        this.timeoutSeconds = timeoutSeconds;
    }

    public Integer getRetryLimit() {
        return retryLimit;
    }

    public void setRetryLimit(Integer retryLimit) {
        this.retryLimit = retryLimit;
    }
}