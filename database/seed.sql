-- =========================================================
-- UNIGOV - Seed Data
-- Phase 1: Departments, Services & Workflow
-- =========================================================

-- =========================================================
-- 1. ROLES
-- =========================================================

INSERT INTO roles (name, description)
VALUES
    ('CITIZEN', 'Citizen who uses government services'),
    ('DEPARTMENT_OFFICER', 'Officer responsible for processing applications'),
    ('ADMIN', 'UNIGOV system administrator')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- 2. DEPARTMENTS
-- =========================================================

INSERT INTO departments (name, code, description)
VALUES
    (
        'Identity Verification Department',
        'IDN',
        'Handles citizen identity verification'
    ),
    (
        'Revenue Department',
        'REV',
        'Handles income and revenue-related verification'
    ),
    (
        'Education Department',
        'EDU',
        'Handles student and education verification'
    ),
    (
        'Scholarship Department',
        'SCH',
        'Processes scholarship applications and approvals'
    )
ON CONFLICT (code) DO NOTHING;


-- =========================================================
-- 3. SERVICES
-- =========================================================

INSERT INTO services (
    name,
    code,
    description,
    department_id
)
SELECT
    'Post-Matric Scholarship',
    'POST_MATRIC_SCHOLARSHIP',
    'Scholarship service requiring identity, income and education verification',
    id
FROM departments
WHERE code = 'SCH'
ON CONFLICT (code) DO NOTHING;


-- =========================================================
-- 4. WORKFLOW DEFINITION
-- =========================================================

INSERT INTO workflow_definitions (
    name,
    version,
    service_id,
    status
)
SELECT
    'Post-Matric Scholarship Verification Workflow',
    1,
    id,
    'ACTIVE'
FROM services
WHERE code = 'POST_MATRIC_SCHOLARSHIP'
ON CONFLICT (service_id, version) DO NOTHING;


-- =========================================================
-- 5. WORKFLOW STEPS
-- =========================================================

INSERT INTO workflow_steps (
    workflow_id,
    step_order,
    name,
    code,
    department_id,
    integration_required,
    timeout_seconds,
    retry_limit
)
SELECT
    w.id,
    1,
    'Identity Verification',
    'IDENTITY_VERIFICATION',
    d.id,
    TRUE,
    30,
    3
FROM workflow_definitions w
JOIN departments d ON d.code = 'IDN'
JOIN services s ON s.id = w.service_id
WHERE s.code = 'POST_MATRIC_SCHOLARSHIP'
  AND w.version = 1
ON CONFLICT (workflow_id, code) DO NOTHING;


INSERT INTO workflow_steps (
    workflow_id,
    step_order,
    name,
    code,
    department_id,
    integration_required,
    timeout_seconds,
    retry_limit
)
SELECT
    w.id,
    2,
    'Income Verification',
    'INCOME_VERIFICATION',
    d.id,
    TRUE,
    30,
    3
FROM workflow_definitions w
JOIN departments d ON d.code = 'REV'
JOIN services s ON s.id = w.service_id
WHERE s.code = 'POST_MATRIC_SCHOLARSHIP'
  AND w.version = 1
ON CONFLICT (workflow_id, code) DO NOTHING;


INSERT INTO workflow_steps (
    workflow_id,
    step_order,
    name,
    code,
    department_id,
    integration_required,
    timeout_seconds,
    retry_limit
)
SELECT
    w.id,
    3,
    'Education Verification',
    'EDUCATION_VERIFICATION',
    d.id,
    TRUE,
    30,
    3
FROM workflow_definitions w
JOIN departments d ON d.code = 'EDU'
JOIN services s ON s.id = w.service_id
WHERE s.code = 'POST_MATRIC_SCHOLARSHIP'
  AND w.version = 1
ON CONFLICT (workflow_id, code) DO NOTHING;


INSERT INTO workflow_steps (
    workflow_id,
    step_order,
    name,
    code,
    department_id,
    integration_required,
    timeout_seconds,
    retry_limit
)
SELECT
    w.id,
    4,
    'Eligibility Check',
    'ELIGIBILITY_CHECK',
    d.id,
    FALSE,
    30,
    0
FROM workflow_definitions w
JOIN departments d ON d.code = 'SCH'
JOIN services s ON s.id = w.service_id
WHERE s.code = 'POST_MATRIC_SCHOLARSHIP'
  AND w.version = 1
ON CONFLICT (workflow_id, code) DO NOTHING;


INSERT INTO workflow_steps (
    workflow_id,
    step_order,
    name,
    code,
    department_id,
    integration_required,
    timeout_seconds,
    retry_limit
)
SELECT
    w.id,
    5,
    'Department Approval',
    'DEPARTMENT_APPROVAL',
    d.id,
    FALSE,
    60,
    0
FROM workflow_definitions w
JOIN departments d ON d.code = 'SCH'
JOIN services s ON s.id = w.service_id
WHERE s.code = 'POST_MATRIC_SCHOLARSHIP'
  AND w.version = 1
ON CONFLICT (workflow_id, code) DO NOTHING;