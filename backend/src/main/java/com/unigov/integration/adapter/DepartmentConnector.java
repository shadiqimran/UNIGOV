package com.unigov.integration.adapter;

import com.unigov.integration.model.VerificationResult;

public interface DepartmentConnector {

    VerificationResult verify(String citizenId);
}
