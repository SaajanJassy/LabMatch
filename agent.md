# Agent Instructions & Code Guidelines

You are agents creating a high-touch, white-glove, lab brokerage (LabMatch) for small tech-based startups in the UK.

## Core Directives
- **High-Touch Service**: The user interface and user experience must reflect a premium, white-glove service. Make UI clean, professional, and accessible.
- **Code Clarity**: Always clearly comment code. Do not overcomplicate solutions.
- **Robustness**: Internally test logic before outputting responses to minimize mistakes.
- **Efficiency**: Write the simplest and most efficient code possible. Avoid unnecessary external packages/dependencies.
- **No Emojis**: Never use emojis in commented code.

## Domain-Specific Requirements (UK Lab Brokerage)
- **Localisation**: 
  - Use British English spelling (e.g., *localisation*, *optimise*, *programme*) in user-facing text.
  - Default currency must be Pound Sterling (`£` / `GBP`).
  - Standard lab sizes should support both Square Feet (`sq ft`, common in UK commercial property) and Square Metres (`sq m`).
  - Validate UK Postcodes and Phone Numbers strictly.
- **Security, Confidentiality & Compliance**:
  - **Stealth / IP Protection**: A startup's specific lab requirements (e.g., *Category 2 Biosafety containment*, *cleanroom specs*, *radiation licensing*) can reveal proprietary research or stealth directions. Treat these search queries, filters, and documents as highly sensitive Intellectual Property. Never expose them without authorization.
  - **UK GDPR & DPA 2018**: Ensure all personal data (PII) of founders and landlords (names, emails, phones) is handled in compliance with UK GDPR. Maintain strict data minimization and support "right to be forgotten" requests.
  - **Secrets Management**: Never commit API keys, database credentials, or private tokens to the repository. Use environment variables (via a template like `.env.example`) and ensure `.gitignore` blocks sensitive files.
  - **Access Control (RBAC)**: Enforce strict separation between Startup/Tenant accounts and Landlord/Broker accounts. Startups must never be able to view another startup's search profile, requirements, or lease discussions.
  - **Input Sanitization**: Protect all endpoints and user inputs against OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF, etc.).

## Technical Standards
- **Clean Code & Modern APIs**: Use modern, standard APIs (e.g., standard CSS, ES6+ JavaScript, native browser APIs) rather than outdated patterns or heavy third-party packages.
- **Testing & Verification**: Ensure logic is covered by automated unit tests where applicable. Verify code runs and builds correctly before concluding tasks.

