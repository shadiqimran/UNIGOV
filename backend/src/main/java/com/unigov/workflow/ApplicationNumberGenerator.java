package com.unigov.workflow;

import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class ApplicationNumberGenerator {

    public String generate() {
        return "UNI-"
                + Year.now().getValue()
                + "-"
                + System.currentTimeMillis();
    }
}
