package com.unigov.integration.mock;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/revenue")
public class MockRevenueController {

    private final MockIntegrationState state;

    public MockRevenueController(MockIntegrationState state) {
        this.state = state;
    }

    @PostMapping("/income-check")
    public ResponseEntity<?> incomeCheck(@RequestBody Map<String, Object> request) {

        if (!state.isAvailable("revenue")) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Revenue department API is temporarily unavailable"
            );
        }

        String citizenId = String.valueOf(
                request.getOrDefault("citizen_identifier", "")
        );

        return ResponseEntity.ok(
                Map.of(
                        "income_verification", "VERIFIED",
                        "income_band", "BELOW_2_LAKH",
                        "revenue_ref", "REV-" + System.currentTimeMillis(),
                        "citizen_identifier", citizenId
                )
        );
    }
}
