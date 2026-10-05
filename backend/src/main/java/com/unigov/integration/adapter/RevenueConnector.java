package com.unigov.integration.adapter;

import com.unigov.integration.model.VerificationResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class RevenueConnector implements DepartmentConnector {

    private final RestClient restClient;

    public RevenueConnector(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public VerificationResult verify(String citizenId) {

        Map<?, ?> response = restClient.post()
                .uri("http://localhost:${PORT:8080}/mock-gov/revenue/income-check")
                .body(Map.of(
                        "citizen_identifier", citizenId
                ))
                .retrieve()
                .body(Map.class);

        String status = String.valueOf(
                response.get("income_verification")
        );

        String reference = String.valueOf(
                response.get("revenue_ref")
        );

        return new VerificationResult(
                "VERIFIED".equals(status),
                "Revenue",
                reference,
                "Revenue response normalized by UNIGOV adapter"
        );
    }
}
