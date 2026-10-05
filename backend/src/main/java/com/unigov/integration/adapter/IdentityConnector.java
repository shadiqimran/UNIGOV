package com.unigov.integration.adapter;

import com.unigov.integration.model.VerificationResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class IdentityConnector implements DepartmentConnector {

    private final RestClient restClient;

    public IdentityConnector(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public VerificationResult verify(String citizenId) {

        Map<?, ?> response = restClient.post()
                .uri("http://localhost:8080/mock-gov/identity/verify")
                .body(Map.of(
                        "full_name", "Demo Citizen",
                        "mobile_number", "9876543210"
                ))
                .retrieve()
                .body(Map.class);

        String status = String.valueOf(response.get("aadhaar_status"));
        String reference = String.valueOf(response.get("identity_reference"));

        return new VerificationResult(
                "VERIFIED".equals(status),
                "Identity Verification",
                reference,
                "Identity response normalized by UNIGOV adapter"
        );
    }
}
