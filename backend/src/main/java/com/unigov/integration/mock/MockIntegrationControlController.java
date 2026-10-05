package com.unigov.integration.mock;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mock-gov/control")
public class MockIntegrationControlController {

    private final MockIntegrationState state;

    public MockIntegrationControlController(MockIntegrationState state) {
        this.state = state;
    }

    @GetMapping
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(state.getAvailability());
    }

    @PostMapping("/{department}/offline")
    public ResponseEntity<?> takeOffline(@PathVariable String department) {
        if (!state.getAvailability().containsKey(department.toLowerCase())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Unknown department: " + department)
            );
        }

        state.setAvailable(department, false);

        return ResponseEntity.ok(
                Map.of(
                        "department", department.toLowerCase(),
                        "status", "OFFLINE",
                        "message", "Mock department API is now unavailable"
                )
        );
    }

    @PostMapping("/{department}/online")
    public ResponseEntity<?> bringOnline(@PathVariable String department) {
        if (!state.getAvailability().containsKey(department.toLowerCase())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Unknown department: " + department)
            );
        }

        state.setAvailable(department, true);

        return ResponseEntity.ok(
                Map.of(
                        "department", department.toLowerCase(),
                        "status", "ONLINE",
                        "message", "Mock department API is now available"
                )
        );
    }
}
