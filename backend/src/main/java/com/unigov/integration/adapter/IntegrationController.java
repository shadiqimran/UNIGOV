package com.unigov.integration.adapter;

import com.unigov.integration.model.VerificationResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integrations")
public class IntegrationController {

    private final IdentityConnector identityConnector;
    private final RevenueConnector revenueConnector;
    private final EducationConnector educationConnector;

    public IntegrationController(
            IdentityConnector identityConnector,
            RevenueConnector revenueConnector,
            EducationConnector educationConnector
    ) {
        this.identityConnector = identityConnector;
        this.revenueConnector = revenueConnector;
        this.educationConnector = educationConnector;
    }

    @GetMapping("/identity/{citizenId}")
    public VerificationResult identity(
            @PathVariable String citizenId
    ) {
        return identityConnector.verify(citizenId);
    }

    @GetMapping("/revenue/{citizenId}")
    public VerificationResult revenue(
            @PathVariable String citizenId
    ) {
        return revenueConnector.verify(citizenId);
    }

    @GetMapping("/education/{citizenId}")
    public VerificationResult education(
            @PathVariable String citizenId
    ) {
        return educationConnector.verify(citizenId);
    }
}
