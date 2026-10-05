package com.unigov.integration.mock;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/education")
public class MockEducationController {

    @PostMapping("/student-check")
    public ResponseEntity<?> studentCheck(@RequestBody Map<String, Object> request) {

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
