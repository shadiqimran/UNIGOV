package com.unigov.integration.mock;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/identity")
public class MockIdentityController {

    @PostMapping("/verify")
    public ResponseEntity<?> verifyIdentity(@RequestBody Map<String, Object> request) {

        String name = String.valueOf(request.getOrDefault("full_name", ""));
        String mobile = String.valueOf(request.getOrDefault("mobile_number", ""));

        boolean verified =
                !name.isBlank() &&
                mobile.matches("\\d{10}");

        return ResponseEntity.ok(
                Map.of(
                        "aadhaar_status", verified ? "VERIFIED" : "FAILED",
                        "identity_reference", "IDN-" + System.currentTimeMillis(),
                        "full_name", name,
                        "mobile_number", mobile
                )
        );
    }
}
