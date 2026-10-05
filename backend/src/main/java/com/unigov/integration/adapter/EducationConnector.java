package com.unigov.integration.adapter;

import com.unigov.integration.model.VerificationResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class EducationConnector implements DepartmentConnector {

    private final RestClient restClient;

    public EducationConnector(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public VerificationResult verify(String citizenId) {

        Map<?, ?> response = restClient.post()
                .uri("http://localhost:8080/mock-gov/education/student-check")
                .body(Map.of(
                        "student_identifier", citizenId
                ))
                .retrieve()
                .body(Map.class);

        String status = String.valueOf(
                response.get("enrollment_status")
        );

        String reference = String.valueOf(
                response.get("education_reference")
        );

        return new VerificationResult(
                "ACTIVE".equals(status),
                "Education",
                reference,
                "Education response normalized by UNIGOV adapter"
        );
    }
}
