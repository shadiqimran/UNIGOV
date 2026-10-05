package com.unigov.integration.mock;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MockIntegrationState {

    private final Map<String, Boolean> availability = new ConcurrentHashMap<>();

    public MockIntegrationState() {
        availability.put("identity", true);
        availability.put("revenue", true);
        availability.put("education", true);
    }

    public boolean isAvailable(String department) {
        return availability.getOrDefault(department.toLowerCase(), true);
    }

    public void setAvailable(String department, boolean available) {
        availability.put(department.toLowerCase(), available);
    }

    public Map<String, Boolean> getAvailability() {
        return Map.copyOf(availability);
    }
}
