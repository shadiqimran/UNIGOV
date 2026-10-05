# UNIGOV System Architecture

## Overview

UNIGOV acts as an interoperability and workflow orchestration layer between citizens and fragmented departmental digital systems.

## High-Level Architecture

```text
Citizen
   |
   v
Next.js Frontend
   |
   v
Spring Boot REST API
   |
   +-- JWT Authentication + RBAC
   +-- Application Service
   +-- Workflow Engine
   +-- Consent Management
   +-- Audit Logging
   |
   v
Interoperability Adapter Layer
   |
   +-- Identity Connector
   +-- Revenue Connector
   +-- Education Connector
   |
   v
Simulated Department APIs
   |
   v
PostgreSQL Database