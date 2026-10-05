# UNIGOV — Unified Government Interoperability Layer

> Smart India Hackathon 2026 — Software Prototype

**Problem Statement:** 26129  
**Organization:** Government of Maharashtra — Maharashtra State Innovation Society  
**Category:** Software  
**Theme:** Miscellaneous

UNIGOV is an interoperability and workflow orchestration platform designed to connect fragmented government digital services through a unified interface.

The prototype demonstrates how multiple departmental systems with different APIs, data formats and processing workflows can be connected through a common interoperability layer while providing unified application tracking, consent management, role-based access control, audit logging, retry handling and administrative monitoring.

> **Prototype Note:** The departmental Identity, Revenue and Education systems used in this prototype are simulated government APIs. UNIGOV demonstrates the integration architecture and workflow using adapters so that authorized real departmental APIs can be connected later without redesigning the citizen-facing workflow.

---

# 1. Problem Statement

Government departments often operate independent:

- Portals
- Databases
- Registries
- Authentication systems
- APIs
- Verification processes
- Workflow systems

Because these systems are developed independently, they may use different:

- Data formats
- Citizen identifiers
- Authentication mechanisms
- API contracts
- Process definitions
- Database structures
- Ownership models

This fragmentation creates problems for both citizens and government officials.

## Problems Faced by Citizens

- Repeated submission of the same information
- Multiple departmental portals
- No single application tracking interface
- Repeated verification
- Delayed processing
- Lack of visibility into application status
- Need to interact with multiple departments

## Problems Faced by Departments

- Fragmented citizen information
- Difficulty communicating across systems
- Lack of consolidated application views
- Manual verification processes
- Difficult exception handling
- Limited monitoring of service-level performance
- Difficulty integrating legacy systems

---

# 2. Expected Solution

The problem statement requires an interoperability/federated architecture capable of supporting:

- API-based data exchange
- Common data standards
- Consent-based data sharing
- Federated identity
- Unified application tracking
- Event-based notifications
- Workflow orchestration
- Legacy-system connectors
- Audit logging
- Role-based access control
- Data quality management
- Exception handling
- Monitoring and operational visibility

UNIGOV addresses the core interoperability requirements through a middleware-style architecture.

---

# 3. UNIGOV Solution

UNIGOV acts as a common interoperability layer between citizens and departmental digital systems.

Instead of forcing a citizen to independently interact with multiple departmental systems, the citizen interacts with a unified UNIGOV interface.

UNIGOV coordinates the required departmental verification operations through:

1. Authentication
2. Role-based access control
3. Application management
4. Workflow orchestration
5. Department adapters
6. Standardized verification results
7. Consent management
8. Audit logging
9. Retry and failure recovery
10. Unified application tracking
11. Administrative monitoring

---

# 4. High-Level Architecture

```text
                           ┌───────────────────┐
                           │      CITIZEN      │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │   UNIGOV FRONTEND │
                           │     Next.js       │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │ Authentication    │
                           │    JWT + RBAC     │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │ Application       │
                           │ Service           │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │ Workflow Engine   │
                           └─────────┬─────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────┐
                  │ Interoperability / Adapter Layer   │
                  └───────────────┬────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
      ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
      │    Identity   │   │    Revenue    │   │   Education   │
      │    Adapter    │   │    Adapter    │   │    Adapter    │
      └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
              │                   │                   │
              ▼                   ▼                   ▼
      ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
      │ Identity API  │   │ Revenue API   │   │ Education API │
      │   (Mock)      │   │    (Mock)     │   │     (Mock)    │
      └───────────────┘   └───────────────┘   └───────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                         ┌───────────────────┐
                         │ Verification      │
                         │ Result            │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Unified Workflow  │
                         │ Status            │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Audit Trail       │
                         │ + Monitoring      │
                         └───────────────────┘

                                   │
                                   ▼

                         ┌───────────────────┐
                         │   PostgreSQL      │
                         │    Database       │
                         └───────────────────┘
```

---

# 5. Core Design Principle

The most important design principle of UNIGOV is:

> **The workflow should not depend directly on the internal implementation of a department.**

Instead:

```text
Workflow Engine
       │
       ▼
Department Connector Interface
       │
       ├──────── Identity Connector
       ├──────── Revenue Connector
       └──────── Education Connector
```

This creates loose coupling between UNIGOV and departmental systems.

If the underlying departmental API changes, the corresponding adapter can be changed without redesigning the complete citizen workflow.

---

# 6. How UNIGOV Works

The complete application lifecycle is:

```text
Citizen Login
     │
     ▼
Select Government Service
     │
     ▼
Create Application
     │
     ▼
Application Stored in PostgreSQL
     │
     ▼
Workflow Created
     │
     ▼
Identity Verification
     │
     ▼
Income Verification
     │
     ▼
Education Verification
     │
     ▼
Eligibility Check
     │
     ▼
Department Approval
     │
     ▼
Application Completed
     │
     ▼
Unified Status + Audit Trail
```

The citizen does not need to manually visit each departmental system.

UNIGOV coordinates the sequence internally.

---

# 7. Citizen Journey

```text
┌──────────────┐
│    Login     │
└──────┬───────┘
       ▼
┌──────────────────────┐
│ Citizen Dashboard    │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Browse Services      │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Apply for Service    │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Application Created  │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Verification         │
│ Workflow             │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Track Application    │
└──────┬───────────────┘
       ▼
┌──────────────────────┐
│ Completed / Failed   │
└──────────────────────┘
```

---

# 8. Demonstrated Government Service

The prototype currently demonstrates:

## Post-Matric Scholarship

Service code:

```text
POST_MATRIC_SCHOLARSHIP
```

The service requires multiple verification stages.

```text
Post-Matric Scholarship
          │
          ▼
Identity Verification
          │
          ▼
Income Verification
          │
          ▼
Education Verification
          │
          ▼
Eligibility Check
          │
          ▼
Department Approval
```

This service was selected because it clearly demonstrates the interoperability problem: one citizen-facing service may require information from multiple departments.

---

# 9. Complete Workflow

UNIGOV currently implements a five-step workflow.

| Step | Department | Operation | Integration |
|---|---|---|---|
| 1 | Identity | Identity Verification | Yes |
| 2 | Revenue | Income Verification | Yes |
| 3 | Education | Education Verification | Yes |
| 4 | Scholarship | Eligibility Check | Internal |
| 5 | Scholarship | Department Approval | Internal |

## Step 1 — Identity Verification

The workflow sends the citizen identifier to the Identity connector.

```text
Workflow Engine
      │
      ▼
IdentityConnector
      │
      ▼
Identity API
      │
      ▼
VerificationResult
```

If successful:

```text
IDENTITY → COMPLETED
```

If unavailable:

```text
IDENTITY → FAILED / RETRY
```

---

# 10. Income Verification

The Revenue connector communicates with the Revenue department API.

```text
Workflow Engine
      │
      ▼
RevenueConnector
      │
      ▼
Revenue API
      │
      ▼
Income Verification Result
```

The workflow only proceeds when the verification stage is successfully completed.

---

# 11. Education Verification

The Education connector communicates with the Education department API.

```text
Workflow Engine
      │
      ▼
EducationConnector
      │
      ▼
Education API
      │
      ▼
Education Verification Result
```

---

# 12. Eligibility Check

After the external verification stages are completed, the workflow reaches the internal eligibility stage.

```text
Identity = COMPLETED
Revenue = COMPLETED
Education = COMPLETED
          │
          ▼
   Eligibility Check
          │
          ▼
       Continue
```

---

# 13. Department Approval

The final stage represents departmental approval.

```text
Eligibility
     │
     ▼
Department Approval
     │
     ▼
Application COMPLETED
```

---

# 14. Application State Machine

Applications can move through multiple states.

```text
                    ┌─────────────┐
                    │  SUBMITTED  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ IN_PROGRESS │
                    └──────┬──────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      ┌─────────────┐             ┌─────────────┐
      │  COMPLETED  │             │    FAILED   │
      └─────────────┘             └──────┬──────┘
                                         │
                                         │ Recovery /
                                         │ Re-execution
                                         ▼
                                  IN_PROGRESS
```

---

# 15. Workflow Engine

The workflow engine is responsible for executing workflow steps in sequence.

Its responsibilities include:

- Reading workflow definition
- Reading workflow steps
- Creating application steps
- Executing pending steps
- Calling integration connectors
- Recording success
- Recording failures
- Retrying failed integrations
- Updating application status
- Completing the workflow

The workflow engine prevents the frontend from having to understand departmental integration details.

---

# 16. Retry Mechanism

UNIGOV includes retry handling for integration failures.

For example:

```text
Revenue API
     │
     ▼
Attempt 1
     │
     X FAILED
     │
     ▼
Attempt 2
     │
     X FAILED
     │
     ▼
Attempt 3
     │
     X FAILED
     │
     ▼
Retry Limit Reached
     │
     ▼
Step = FAILED
     │
     ▼
Application = FAILED
     │
     ▼
Audit Log
```

The workflow engine uses the configured retry limit for each workflow step.

---

# 17. Failure Recovery

A major demonstration feature is departmental API failure.

The admin can intentionally mark a simulated department API as offline.

Example:

```text
Admin
  │
  ▼
Revenue API → OFFLINE
  │
  ▼
Citizen runs workflow
  │
  ▼
Revenue Connector
  │
  ▼
HTTP 503
  │
  ▼
Retry Mechanism
  │
  ├── Attempt 1
  ├── Attempt 2
  └── Attempt 3
  │
  ▼
Failure Recorded
  │
  ▼
Application FAILED
```

The admin can then bring the department online again.

```text
Revenue API
    │
    ▼
ONLINE
    │
    ▼
Workflow can be executed again
    │
    ▼
Verification succeeds
```

This demonstrates that UNIGOV can explicitly handle integration failures rather than silently losing an application.

---

# 18. Interoperability Adapter Architecture

UNIGOV uses an adapter pattern.

```text
                 Workflow Engine
                       │
                       ▼
             DepartmentConnector
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 IdentityConnector RevenueConnector EducationConnector
        │              │              │
        ▼              ▼              ▼
 Identity API     Revenue API     Education API
```

The workflow engine does not need to know the internal API implementation of each department.

---

# 19. Standardized Verification Result

Department-specific responses are normalized by the adapter layer.

Conceptually:

```text
Department-specific response
            │
            ▼
       Connector
            │
            ▼
   VerificationResult
            │
      ┌─────┴─────┐
      │           │
    status      message
      │           │
      └─────┬─────┘
            ▼
     Workflow Engine
```

This creates a common internal representation even if different departments use different API formats.

---

# 20. Canonical Interoperability Concept

Without an interoperability layer:

```text
Citizen
 ├── Portal A
 ├── Portal B
 ├── Portal C
 └── Portal D
```

With UNIGOV:

```text
Citizen
   │
   ▼
UNIGOV
   │
   ├── Department A
   ├── Department B
   ├── Department C
   └── Department D
```

The unified layer becomes the coordination point.

---

# 21. Authentication

UNIGOV uses JWT-based authentication.

Basic flow:

```text
User
 │
 ▼
Login API
 │
 ▼
Credentials Validated
 │
 ▼
JWT Generated
 │
 ▼
Frontend Stores Token
 │
 ▼
Authorization Header
 │
 ▼
Protected API
```

Protected API requests include the JWT token.

---

# 22. Role-Based Access Control

UNIGOV currently defines:

```text
CITIZEN
DEPARTMENT_OFFICER
ADMIN
```

## Citizen

Citizen access includes:

- Citizen dashboard
- Government services
- Applications
- Application tracking
- Consent management

## Department Officer

Department officers are intended for operational department-level access.

## Admin

Admin access includes:

- Administrative dashboard
- Application management
- Audit logs
- Integration controls
- Operational monitoring

---

# 23. Security Architecture

```text
                 Request
                    │
                    ▼
             JWT Authentication
                    │
                    ▼
              User Identity
                    │
                    ▼
               Role Check
                    │
          ┌─────────┴─────────┐
          │                   │
       Allowed             Denied
          │                   │
          ▼                   ▼
      API Logic             403
```

The backend is responsible for authorization.

Frontend visibility alone is not treated as the security boundary.

---

# 24. Consent Management

UNIGOV provides citizen consent management.

A citizen can:

- View granted consents
- Grant consent
- View active consents
- Revoke consent

Conceptual flow:

```text
Citizen
   │
   ▼
Consent Page
   │
   ▼
Select Department
   │
   ▼
Enter Purpose
   │
   ▼
Grant Consent
   │
   ▼
Consent Stored
   │
   ▼
Audit Log
```

Revocation:

```text
Active Consent
      │
      ▼
Revoke
      │
      ▼
Consent Status = REVOKED
      │
      ▼
Audit Log
```

Consent records contain information such as:

- Citizen
- Department
- Service
- Purpose
- Status
- Granted timestamp
- Revoked timestamp

---

# 25. Audit Logging

Important operations are recorded in the audit log.

Examples include:

- Consent granted
- Consent revoked
- Application events
- Workflow failures
- Retry exhaustion
- Administrative operations

Conceptual structure:

```text
User Action
    │
    ▼
Business Operation
    │
    ▼
AuditLogService
    │
    ▼
PostgreSQL
    │
    ▼
Admin Audit Log
```

This provides traceability for administrative and operational investigation.

---

# 26. Unified Application Tracking

The citizen does not need to understand which department is currently processing the application.

Instead, UNIGOV provides:

```text
Application Number
Application Status
Current Step
Workflow Steps
Step Status
Completion Information
```

Example:

```text
Application: UNI-2026-XXXX

Identity Verification       ✓ COMPLETED
Income Verification         ✓ COMPLETED
Education Verification      ✓ COMPLETED
Eligibility Check           ✓ COMPLETED
Department Approval         ✓ COMPLETED

Application Status: COMPLETED
```

---

# 27. Admin Control Center

The admin dashboard provides a consolidated operational view.

It includes:

- Total applications
- Applications in progress
- Completed applications
- Failed applications
- Recent applications
- Integration health
- Recent audit activity
- Application management

This directly addresses the problem of departments having fragmented operational views.

---

# 28. Integration Health Monitoring

The prototype provides controls for simulated departmental integrations.

Current integrations:

```text
Identity
Revenue
Education
```

Each integration can be:

```text
ONLINE
OFFLINE
```

This allows the demo to reproduce real-world dependency failures.

---

# 29. Integration Failure Demonstration

The complete demo scenario:

```text
1. Admin opens Integration Controls
             │
             ▼
2. Revenue API is set OFFLINE
             │
             ▼
3. Citizen creates/runs application
             │
             ▼
4. Workflow reaches Revenue Verification
             │
             ▼
5. Revenue API returns failure
             │
             ▼
6. Retry engine executes configured attempts
             │
             ▼
7. Failure is recorded
             │
             ▼
8. Admin restores Revenue API
             │
             ▼
9. Workflow can be executed again
             │
             ▼
10. Application progresses
```

This is one of the primary technical demonstrations of the prototype.

---

# 30. Admin Application Management

Administrators can inspect applications centrally.

The admin application view supports:

- Application listing
- Status filtering
- Application details
- Workflow state
- Current step
- Re-execution of workflow

Instead of checking multiple department systems separately, the administrator gets a unified application view.

---

# 31. Database Architecture

UNIGOV uses PostgreSQL.

Core entities include:

```text
Roles
Users
Citizen Profiles
Departments
Services
Workflow Definitions
Workflow Steps
Applications
Application Steps
Consents
Audit Logs
```

---

# 32. Database Relationship Diagram

```text
┌─────────────┐
│    Roles    │
└──────┬──────┘
       │
       │
       ▼
┌─────────────┐
│    Users    │
└──────┬──────┘
       │
       ├───────────────┐
       │               │
       ▼               ▼
┌───────────────┐  ┌───────────────┐
│CitizenProfile │  │  AuditLogs    │
└───────────────┘  └───────────────┘

┌───────────────┐
│ Departments   │
└───────┬───────┘
        │
        ├──────────────┐
        │              │
        ▼              ▼
┌───────────────┐  ┌───────────────┐
│   Services    │  │Workflow Steps │
└───────┬───────┘  └───────────────┘
        │
        ▼
┌──────────────────┐
│Workflow Definition│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Applications   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Application Steps │
└──────────────────┘

Users + Departments + Services
             │
             ▼
        ┌──────────┐
        │ Consents │
        └──────────┘
```

---

# 33. Main Database Tables

| Table | Purpose |
|---|---|
| `roles` | System roles |
| `users` | User accounts |
| `citizen_profiles` | Citizen-specific profile information |
| `departments` | Department registry |
| `services` | Government service catalogue |
| `workflow_definitions` | Workflow definitions |
| `workflow_steps` | Ordered workflow stages |
| `applications` | Citizen applications |
| `application_steps` | Runtime workflow state |
| `consents` | Citizen consent records |
| `audit_logs` | Operational audit history |

---

# 34. Application vs Application Step

UNIGOV separates:

```text
Application
```

from:

```text
ApplicationStep
```

The application represents the overall service request.

The application steps represent the individual stages of processing.

Example:

```text
Application #1001
       │
       ├── Step 1 Identity
       ├── Step 2 Income
       ├── Step 3 Education
       ├── Step 4 Eligibility
       └── Step 5 Approval
```

This makes workflow state independently trackable.

---

# 35. Backend Architecture

The Spring Boot backend is organized into logical layers.

```text
backend/
└── src/main/java/com/unigov/
    │
    ├── controller/
    │
    ├── service/
    │
    ├── repository/
    │
    ├── entity/
    │
    ├── dto/
    │
    ├── security/
    │
    ├── integration/
    │
    ├── workflow/
    │
    ├── exception/
    │
    └── audit/
```

---

# 36. Controller Layer

Controllers expose REST APIs.

Examples:

```text
/api/auth/*
/api/services
/api/applications/*
/api/citizen/consents/*
/api/admin/*
/api/workflows/*
/api/integrations/*
/mock-gov/*
```

Controllers are responsible for receiving HTTP requests and passing operations to the service layer.

---

# 37. Service Layer

The service layer contains business logic.

Examples include:

```text
ApplicationService
ConsentService
AuditLogService
UserService
Workflow services
```

This prevents business logic from being tightly coupled to HTTP controllers.

---

# 38. Repository Layer

Spring Data JPA repositories provide database access.

Repositories are used for entities such as:

- User
- Role
- Department
- Service
- Application
- ApplicationStep
- Workflow
- WorkflowStep
- Consent
- AuditLog

---

# 39. Integration Layer

The integration package contains department connectors.

Conceptually:

```text
integration/
│
├── DepartmentConnector
├── IdentityConnector
├── RevenueConnector
├── EducationConnector
└── VerificationResult
```

The connector layer isolates external system communication from the workflow engine.

---

# 40. Frontend Architecture

The frontend uses:

- Next.js
- React
- TypeScript
- Tailwind CSS

Main application areas include:

```text
frontend/src/app/
│
├── page.tsx
├── login/
├── dashboard/
├── applications/
├── consents/
└── admin/
    ├── page.tsx
    ├── applications/
    ├── audit-logs/
    └── integrations/
```

---

# 41. Frontend Pages

## Public

```text
/
```

Landing page.

## Authentication

```text
/login
```

## Citizen

```text
/dashboard
/applications
/applications/[id]
/consents
```

## Admin

```text
/admin
/admin/applications
/admin/audit-logs
/admin/integrations
```

---

# 42. REST API Architecture

The general request flow is:

```text
Browser
   │
   ▼
Next.js
   │
   │ HTTP / JSON
   ▼
Spring Boot REST API
   │
   ▼
Service Layer
   │
   ├───────────────┐
   │               │
   ▼               ▼
PostgreSQL     Integration Layer
                   │
                   ▼
             Department API
```

---

# 43. Important API Endpoints

## Authentication

```text
POST /api/auth/login
```

## Services

```text
GET /api/services
```

## Applications

```text
POST /api/applications
GET  /api/applications
GET  /api/applications/{id}
GET  /api/applications/{id}/steps
GET  /api/applications/citizen/{citizenId}
GET  /api/applications/status/{status}
```

## Workflow

```text
POST /api/workflows/applications/{applicationId}/execute
```

## Consent

```text
GET  /api/citizen/consents
GET  /api/citizen/consents/active
POST /api/citizen/consents
POST /api/citizen/consents/{consentId}/revoke
```

## Admin Audit

```text
GET /api/admin/audit-logs
GET /api/admin/audit-logs/user/{id}
GET /api/admin/audit-logs/application/{id}
GET /api/admin/audit-logs/department/{id}
```

## Integration Controls

```text
GET  /mock-gov/control
POST /mock-gov/control/{department}/offline
POST /mock-gov/control/{department}/online
```

---

# 44. API Request Lifecycle

Example: running an application workflow.

```text
POST /api/workflows/applications/8/execute
              │
              ▼
      Workflow Controller
              │
              ▼
       Workflow Engine
              │
              ▼
       Current Application Step
              │
              ▼
       Department Connector
              │
              ▼
       Department API
              │
              ▼
     Verification Result
              │
              ▼
       Update ApplicationStep
              │
              ▼
       Update Application
              │
              ▼
          Audit Log
              │
              ▼
       JSON Response
```

---

# 45. Example Workflow Response

A workflow execution returns information such as:

```json
{
  "applicationId": 8,
  "applicationNumber": "UNI-2026-XXXX",
  "status": "COMPLETED",
  "currentStepOrder": 5,
  "message": "Workflow execution completed"
}
```

The exact application number is generated by the backend.

---

# 46. Sequence Diagram — Successful Application

```text
Citizen
   |
   | Login
   v
Frontend
   |
   | JWT authenticated request
   v
Backend
   |
   | Create Application
   v
PostgreSQL
   |
   | Application + Steps
   v
Workflow Engine
   |
   | Identity verification
   v
Identity Adapter
   |
   v
Identity API
   |
   | SUCCESS
   v
Workflow Engine
   |
   | Revenue verification
   v
Revenue Adapter
   |
   v
Revenue API
   |
   | SUCCESS
   v
Workflow Engine
   |
   | Education verification
   v
Education Adapter
   |
   v
Education API
   |
   | SUCCESS
   v
Workflow Engine
   |
   | Eligibility
   v
Workflow Engine
   |
   | Approval
   v
PostgreSQL
   |
   v
Unified COMPLETED Status
```

---

# 47. Sequence Diagram — Failed Integration

```text
Citizen
   |
   v
Frontend
   |
   v
Workflow Engine
   |
   v
Revenue Adapter
   |
   v
Revenue API
   |
   X
   | 503 Service Unavailable
   |
   v
Retry Engine
   |
   ├── Attempt 1
   ├── Attempt 2
   └── Attempt 3
          |
          X
          |
          v
      Step FAILED
          |
          v
   Application FAILED
          |
          v
      Audit Log
```

---

# 48. Admin Operational Flow

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├──────────────► Applications
     │
     ├──────────────► Audit Logs
     │
     └──────────────► Integration Controls
                            │
                            ├── Identity
                            ├── Revenue
                            └── Education
```

---

# 49. Demo Dataset

The prototype contains realistic seeded demonstration data to make the administrative dashboard meaningful during presentation.

Current seeded application distribution:

| Status | Applications |
|---|---:|
| COMPLETED | 14 |
| FAILED | 5 |
| IN_PROGRESS | 5 |
| SUBMITTED | 9 |
| **TOTAL** | **33** |

The database also contains:

```text
33 Applications
165 Application Steps
44 Audit Logs
```

The demo dataset intentionally contains multiple application states so that the admin dashboard can demonstrate:

- Successful applications
- Failed applications
- Applications currently processing
- Newly submitted applications
- Workflow monitoring

---

# 50. Application Status Distribution

```text
COMPLETED     ██████████████ 14
SUBMITTED     █████████       9
IN_PROGRESS   █████           5
FAILED        █████           5
```

Percentage distribution:

```text
COMPLETED     42.4%
SUBMITTED     27.3%
IN_PROGRESS   15.2%
FAILED        15.2%
```

These values are based on the seeded prototype dataset.

---

# 51. Workflow Volume

Each application uses five workflow stages.

Therefore the current 33-application demonstration dataset contains:

```text
33 Applications
       ×
5 Workflow Steps
       =
165 Application Steps
```

This allows the dashboard and database to demonstrate workflow-level state tracking rather than only application-level status.

---

# 52. Operational Monitoring Concept

A production UNIGOV deployment can use the same architecture to measure:

```text
Application Processing Time
Department Response Time
API Success Rate
API Failure Rate
Retry Frequency
Workflow Completion Rate
SLA Compliance
Pending Applications
Failed Integrations
```

The current prototype demonstrates the underlying data and control architecture required for these metrics.

---

# 53. Why the Adapter Layer Matters

A direct implementation would look like:

```text
Workflow
   ↓
Identity API
```

and:

```text
Workflow
   ↓
Revenue API
```

This creates strong coupling.

UNIGOV instead uses:

```text
Workflow
   ↓
Connector Interface
   ↓
Department Adapter
   ↓
Department API
```

This makes it easier to replace or extend integrations.

For example:

```text
Current:
RevenueConnector
      ↓
Mock Revenue API

Future:
RevenueConnector
      ↓
Authorized Maharashtra Revenue API
```

The workflow engine does not need to change.

---

# 54. Legacy System Integration Strategy

Government systems may not all expose modern REST APIs.

The adapter architecture allows future connectors such as:

```text
REST Connector
SOAP Connector
Legacy Database Connector
File-Based Connector
Government Gateway Connector
Message Queue Connector
```

The prototype currently demonstrates REST-based simulated department APIs.

The same connector concept can be extended to authorized real systems.

---

# 55. Data Standardization Strategy

Different departments may return different response structures.

UNIGOV's adapter layer acts as a normalization boundary.

Conceptually:

```text
Department A Format
        │
        ▼
 Adapter / Mapper
        │
        ▼
Common UNIGOV Model
        │
        ▼
Workflow Engine
```

This reduces the amount of department-specific logic required inside the core workflow.

---

# 56. Exception Handling

Failures are not ignored.

An integration failure is represented in the application workflow.

The application step can record:

- Status
- Error message
- Retry count
- Start time
- Completion time

This gives administrators visibility into why an application failed.

---

# 57. Observability

UNIGOV provides several levels of visibility:

### Citizen

```text
Application
   ↓
Current Status
   ↓
Workflow Steps
```

### Admin

```text
Applications
   +
Integration Health
   +
Audit Logs
   +
Failure Information
```

### Backend

```text
Application Step
   +
Retry Count
   +
Error Message
   +
Timestamps
```

---

# 58. Why UNIGOV Is Different

UNIGOV is not simply another government service portal.

The primary objective is **system interoperability**.

The key layer is:

```text
Citizen Applications
        ↓
Workflow Orchestration
        ↓
Interoperability Layer
        ↓
Department Systems
```

The citizen interface is only one part of the platform.

The core value lies in connecting independently managed systems through standardized adapters and a common workflow model.

---

# 59. Major Technical Features

| Feature | Implementation |
|---|---|
| Unified citizen interface | Next.js |
| REST backend | Spring Boot |
| Database | PostgreSQL |
| Authentication | JWT |
| Authorization | RBAC |
| Workflow | Spring Boot workflow engine |
| Department integration | Adapter pattern |
| Identity integration | Simulated API |
| Revenue integration | Simulated API |
| Education integration | Simulated API |
| Retry handling | Workflow retry mechanism |
| Consent | Consent APIs + UI |
| Audit | AuditLogService + database |
| Admin monitoring | Admin dashboard |
| Integration control | Mock department controls |
| Application tracking | Citizen tracking UI |
| Data persistence | PostgreSQL |
| API communication | REST / JSON |

---

# 60. Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

## Backend

```text
Java
Spring Boot
Spring Security
Spring Data JPA
REST APIs
JWT
```

## Database

```text
PostgreSQL
```

## Development

```text
Git
GitHub
Maven
npm
VS Code
```

---

# 61. Project Structure

```text
UNIGOV/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/unigov/
│           │       ├── controller/
│           │       ├── service/
│           │       ├── repository/
│           │       ├── entity/
│           │       ├── dto/
│           │       ├── security/
│           │       ├── integration/
│           │       ├── workflow/
│           │       └── exception/
│           │
│           └── resources/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   └── architecture.md
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── services/
│
├── README.md
└── .gitignore
```

---

# 62. Local Setup

## Requirements

Install:

```text
Node.js
Java 21+
Maven
PostgreSQL
Git
```

---

# 63. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE unigov;
```

Then execute the schema and seed scripts.

```text
database/schema.sql
database/seed.sql
```

The schema creates the required tables and the seed script inserts the demonstration departments, service, workflow and users.

---

# 64. Backend Configuration

The backend connects to PostgreSQL using Spring Boot configuration.

Default backend port:

```text
8080
```

Backend base URL:

```text
http://localhost:8080
```

---

# 65. Frontend Configuration

The frontend runs using Next.js.

Default frontend port:

```text
3000
```

Frontend URL:

```text
http://localhost:3000
```

The frontend communicates with the Spring Boot backend through REST APIs.

---

# 66. Running the Backend

From the project root:

```bash
cd backend
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

---

# 67. Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on:

```text
http://localhost:3000
```

---

# 68. Health Check

The backend exposes an actuator health endpoint:

```text
GET /actuator/health
```

Expected response indicates that the backend is running.

---

# 69. Demo Credentials

## Citizen

```text
Email:
citizen@unigov.demo

Password:
Citizen@123
```

## Admin

```text
Email:
admin@unigov.demo

Password:
Admin@123
```

> These credentials are for local demonstration only and must be replaced in a production deployment.

---

# 70. Recommended Judge Demo

The strongest demonstration flow is:

```text
1. Open UNIGOV
        ↓
2. Login as Citizen
        ↓
3. Open Services
        ↓
4. Apply for Post-Matric Scholarship
        ↓
5. Open Application Tracking
        ↓
6. Execute Verification Workflow
        ↓
7. Show five workflow stages
        ↓
8. Show COMPLETED result
        ↓
9. Login as Admin
        ↓
10. Show 33 applications
        ↓
11. Show application statuses
        ↓
12. Open Integration Controls
        ↓
13. Turn Revenue OFFLINE
        ↓
14. Execute another workflow
        ↓
15. Show retry/failure
        ↓
16. Restore Revenue ONLINE
        ↓
17. Re-execute workflow
        ↓
18. Show successful progression
        ↓
19. Open Audit Logs
        ↓
20. Show recorded operations
```

---

# 71. Suggested 3-Minute Judge Explanation

### Problem

> Government departments already have digital systems, but these systems often operate independently. Their identifiers, APIs, data formats and workflows can differ, forcing citizens and officials to deal with fragmented processes.

### Solution

> UNIGOV introduces an interoperability layer between these systems. A citizen interacts with one unified interface while UNIGOV's workflow engine coordinates verification across different departmental systems through adapters.

### Technical USP

> The important part is the adapter architecture. The workflow engine does not directly depend on a department's API implementation. Each department is accessed through a connector, allowing the same workflow to work with different departmental systems.

### Reliability

> We also demonstrate failure recovery. If a departmental API goes offline, the workflow records the failure, retries according to the configured policy and exposes the failure to administrators instead of silently losing the application.

### Governance

> Consent management, RBAC and audit logs provide control and traceability around sensitive cross-department operations.

---

# 72. Security Considerations

The prototype implements:

- JWT authentication
- Role-based authorization
- Protected backend routes
- Admin-only routes
- Citizen-specific operations
- Consent records
- Audit logging

A production implementation should additionally include:

- Strong secret management
- HTTPS
- Key rotation
- Encryption at rest
- Encryption in transit
- Government identity integration
- Fine-grained authorization
- Security monitoring
- Rate limiting
- API gateway controls
- Vulnerability scanning
- Centralized secrets management

---

# 73. Production Architecture

A production deployment could evolve into:

```text
                        Citizens
                           │
                           ▼
                     API Gateway
                           │
                           ▼
                  ┌─────────────────┐
                  │     UNIGOV      │
                  │ Interoperability│
                  │      Layer      │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Identity       Revenue       Education
        System         System        System
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Workflow Engine
                           │
                           ▼
                     Event / Audit
                           │
                           ▼
                    Monitoring Layer
```

---

# 74. Scalability

The architecture can be extended by adding new adapters.

For example:

```text
Existing

IdentityConnector
RevenueConnector
EducationConnector


Future

IdentityConnector
RevenueConnector
EducationConnector
HealthConnector
EmploymentConnector
CasteCertificateConnector
ResidenceConnector
BankingConnector
DocumentConnector
```

The core workflow architecture remains reusable.

---

# 75. New Service Creation

A future service can be modeled using workflow definitions.

Example:

```text
New Service
    │
    ▼
Workflow Definition
    │
    ├── Identity Verification
    ├── Residence Verification
    ├── Income Verification
    ├── Document Verification
    └── Department Approval
```

This demonstrates why workflow configuration is important for a multi-department platform.

---

# 76. Future Enhancements

The prototype establishes the core interoperability architecture.

Future production features can include:

## Federated Government Identity

Integration with an authorized government identity provider.

## Real Department APIs

Replace simulated APIs with authorized government APIs through formal integration agreements.

## Event-Driven Architecture

Use event brokers for asynchronous processing.

Possible technologies:

```text
Kafka
RabbitMQ
Government Message Bus
```

## Notifications

```text
SMS
Email
Push Notification
Portal Notification
```

## Advanced Monitoring

```text
Prometheus
Grafana
OpenTelemetry
Centralized Logging
```

## API Gateway

Introduce centralized:

- Rate limiting
- Authentication
- Routing
- API versioning
- Monitoring

## Data Quality Engine

Add:

- Schema validation
- Duplicate detection
- Identifier reconciliation
- Data consistency checks

---

# 77. Event-Driven Future Architecture

A future asynchronous workflow can use:

```text
Application Created
        │
        ▼
   Event Bus
        │
   ┌────┼────┐
   ▼    ▼    ▼
Identity Revenue Education
   │    │    │
   └────┼────┘
        ▼
Verification Events
        │
        ▼
Workflow Engine
        │
        ▼
Application Status
```

This would reduce synchronous dependency between departments.

---

# 78. SLA Monitoring

A production system can calculate:

```text
SLA Compliance =
Completed Within SLA
--------------------
Total Completed
```

Additional metrics:

```text
Average Verification Time
Average Department Response Time
Failure Rate
Retry Rate
Completion Rate
Pending Duration
```

The current prototype already stores workflow timestamps and states required for building these metrics.

---

# 79. Data Privacy Principle

Government interoperability must not mean unrestricted data sharing.

The intended architecture is:

```text
Citizen
   │
   ▼
Consent
   │
   ▼
Authorized Purpose
   │
   ▼
Required Department
   │
   ▼
Required Data
```

Only the data required for the intended service operation should be shared in a production implementation.

---

# 80. Failure Philosophy

UNIGOV follows an explicit failure-handling approach.

Instead of:

```text
API failed
    ↓
Application disappears
```

UNIGOV uses:

```text
API failed
    ↓
Record failure
    ↓
Retry
    ↓
Record retry count
    ↓
Expose error
    ↓
Allow operational recovery
```

This makes failures observable and actionable.

---

# 81. Interoperability Benefits

UNIGOV can provide:

### For Citizens

- One interface
- Unified tracking
- Reduced repetition
- Better visibility

### For Departments

- Standard integration boundary
- Workflow coordination
- Centralized monitoring
- Better exception visibility

### For Administrators

- Consolidated application view
- Integration health
- Audit trail
- Failure monitoring

### For Government IT Ecosystems

- Reusable adapters
- Common workflow model
- Standardized internal responses
- Easier future integrations

---

# 82. Prototype Scope vs Production Scope

| Capability | Prototype | Production Direction |
|---|---|---|
| Unified UI | Implemented | Extend |
| JWT | Implemented | Government identity |
| RBAC | Implemented | Fine-grained RBAC |
| PostgreSQL | Implemented | HA database |
| Workflow engine | Implemented | Distributed workflow |
| Department adapters | Implemented | Real authorized APIs |
| Identity API | Simulated | Real integration |
| Revenue API | Simulated | Real integration |
| Education API | Simulated | Real integration |
| Retry handling | Implemented | Queue-based recovery |
| Consent | Implemented | Policy enforcement |
| Audit logs | Implemented | Centralized immutable audit |
| Monitoring | Prototype | Observability stack |
| Notifications | Future | SMS/Email/Push |
| Event architecture | Future | Event bus |
| API Gateway | Future | Government API gateway |

---

# 83. What Is Actually Demonstrated

The prototype demonstrates a complete technical flow:

```text
Citizen
  ↓
Authentication
  ↓
Service Selection
  ↓
Application Creation
  ↓
Workflow Initialization
  ↓
Identity Integration
  ↓
Revenue Integration
  ↓
Education Integration
  ↓
Eligibility
  ↓
Approval
  ↓
Application Completion
  ↓
Audit Logging
```

It also demonstrates:

```text
Department Offline
       ↓
Integration Failure
       ↓
Retry
       ↓
Failure Recording
       ↓
Department Restored
       ↓
Workflow Re-execution
```

---

# 84. Key Technical USP

The primary technical USP of UNIGOV is:

> **A reusable interoperability and workflow layer that separates citizen-facing services from departmental implementation details.**

Instead of creating custom point-to-point integrations:

```text
Department A ←→ Department B
Department A ←→ Department C
Department B ←→ Department C
```

UNIGOV introduces a common integration layer:

```text
                 UNIGOV
               /   |   \
              /    |    \
             ▼     ▼     ▼
          Dept A Dept B Dept C
```

This creates a more manageable integration model as the number of participating systems increases.

---

# 85. Integration Growth Model

Without a common interoperability layer, point-to-point integrations can grow rapidly as departments are added.

With UNIGOV:

```text
                    UNIGOV
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Department A   Department B   Department C
        │              │              │
        ▼              ▼              ▼
       API            API            API
```

Each new department can be integrated through its own adapter.

---

# 86. Testing Strategy

The prototype can be tested at multiple levels.

## Authentication

- Valid login
- Invalid password
- Protected route access
- Role-based access

## Application

- Create application
- List applications
- Application details
- Application steps

## Workflow

- Successful workflow
- Failed integration
- Retry
- Workflow completion

## Consent

- Grant consent
- View consent
- Revoke consent

## Admin

- Application management
- Audit logs
- Integration controls

---

# 87. Demo Test Matrix

| Test | Expected Result |
|---|---|
| Valid citizen login | Dashboard opens |
| Valid admin login | Admin dashboard opens |
| Create application | Application created |
| Execute workflow | Steps execute sequentially |
| Department online | Verification succeeds |
| Department offline | Integration fails |
| Retry enabled | Multiple attempts occur |
| Retry exhausted | Step/application marked failed |
| Restore API | Workflow can recover |
| Grant consent | Consent recorded |
| Revoke consent | Consent marked revoked |
| Admin audit view | Audit records visible |

---

# 88. Project Status

## Completed

- [x] Next.js frontend
- [x] Spring Boot backend
- [x] PostgreSQL database
- [x] JWT authentication
- [x] RBAC
- [x] Citizen dashboard
- [x] Service catalogue
- [x] Application creation
- [x] Application tracking
- [x] Five-step workflow
- [x] Identity adapter
- [x] Revenue adapter
- [x] Education adapter
- [x] Simulated departmental APIs
- [x] Retry mechanism
- [x] Failure recovery
- [x] Consent management
- [x] Audit logging
- [x] Admin dashboard
- [x] Admin application management
- [x] Integration health controls
- [x] Demo dataset
- [x] Documentation

---

# 89. Limitations of Current Prototype

This project is an SIH prototype and does not claim direct access to real government databases.

The current departmental systems are simulated.

The prototype does not currently implement:

- Production government identity integration
- Real departmental databases
- Real government API credentials
- Production SMS/email infrastructure
- Distributed event bus
- Production-grade API gateway
- High-availability deployment

These are intentionally separated from the prototype so that the interoperability architecture can be demonstrated safely without unauthorized access to government systems.

---

# 90. Deployment Direction

The prototype is designed so that frontend and backend can be deployed independently.

```text
Frontend
   │
   ▼
Public Web Application
   │
   ▼
Spring Boot Backend
   │
   ├── PostgreSQL
   └── Department Connectors
```

For production deployment:

```text
HTTPS
API Gateway
Load Balancer
Application Servers
PostgreSQL HA
Monitoring
Centralized Logging
Secret Management
```

---

# 91. Future Vision

UNIGOV can evolve from a scholarship demonstration into a broader interoperability platform.

Possible service workflows:

```text
Scholarships
      │
      ├── Identity
      ├── Income
      ├── Education
      └── Approval


Employment Services
      │
      ├── Identity
      ├── Education
      ├── Skill Records
      └── Employment Department


Certificates
      │
      ├── Identity
      ├── Residence
      ├── Supporting Documents
      └── Issuing Department
```

The common platform remains:

```text
Authentication
      +
Consent
      +
Workflow
      +
Interoperability
      +
Audit
      +
Monitoring
```

---

# 92. Final Architecture Summary

```text
                         ┌──────────────┐
                         │   CITIZEN    │
                         └──────┬───────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │   Next.js Frontend │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ JWT + RBAC Security│
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ Application Service│
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │  Workflow Engine   │
                     └─────────┬──────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │ Interoperability Adapter     │
                │ Layer                        │
                └──────────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
         Identity           Revenue          Education
         Adapter            Adapter           Adapter
              │                │                │
              ▼                ▼                ▼
        Identity API       Revenue API     Education API
         (Simulated)        (Simulated)      (Simulated)
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ Verification Result│
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │ Unified Application│
                     │      Status        │
                     └─────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
              Audit Logging         PostgreSQL
                    │
                    ▼
              Admin Dashboard
```

---

# 93. Conclusion

UNIGOV demonstrates how fragmented government digital services can be connected through a reusable interoperability layer.

The core architecture separates:

```text
Citizen Experience
        ↓
Business Workflow
        ↓
Interoperability
        ↓
Department Systems
```

This separation makes the platform easier to extend, monitor and integrate.

The prototype demonstrates:

- Unified service access
- Application orchestration
- Multi-department verification
- Adapter-based interoperability
- JWT authentication
- RBAC
- Consent management
- Audit logging
- Retry handling
- Failure recovery
- Unified application tracking
- Administrative monitoring

The long-term objective is to provide a common digital interoperability layer through which multiple authorized government systems can participate in unified citizen-centric workflows.

---

# UNIGOV

### Wear the complexity of government systems behind one interoperable layer.

**Smart India Hackathon 2026 — Problem Statement 26129**

**Government of Maharashtra — Maharashtra State Innovation Society**