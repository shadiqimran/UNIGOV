package com.unigov.integration.mock;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/revenue")
public class MockRevenueController {

    @PostMapping("/income-check")
    public ResponseEntity<?> incomeCheck(@RequestBody Map<String, Object> request) {

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
