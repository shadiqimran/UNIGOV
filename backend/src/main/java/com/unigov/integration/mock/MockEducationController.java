package com.unigov.integration.mock;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/education")
public class MockEducationController {

    private final MockIntegrationState state;

    public MockEducationController(MockIntegrationState state) {
        this.state = state;
    }

    @PostMapping("/student-check")
    public ResponseEntity<?> studentCheck(@RequestBody Map<String, Object> request) {

        if (!state.isAvailable("education")) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Education department API is temporarily unavailable"
            );
        }

        String studentId = String.valueOf(
                request.getOrDefault("student_identifier", "")
        );

        return ResponseEntity.ok(
                Map.of(
                        "enrollment_status", "ACTIVE",
                        "academic_status", "ELIGIBLE",
                        "education_reference", "EDU-" + System.currentTimeMillis(),
                        "student_identifier", studentId
                )
        );
    }
}
