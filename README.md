# LabMatch: Premium Lab Brokerage Platform

LabMatch is a high-touch, white-glove B2B brokerage-led platform connecting early-stage science and engineering startups with small, high-specification laboratory and hybrid workspaces (typically $<5,000\text{ sq ft}$) in the UK. 

We address the market failure where traditional brokers deprioritise these small, specialist deals by utilising deterministic filtering combined with a custom AI matching layer.

---

## 1. Startup Workflow
Startups engage with LabMatch to find compliant, ready-to-use lab spaces.
1. **Intake**: Startups submit detailed requirements:
   - Sector & Business Details (e.g., biological/chemical handling specifications)
   - Headcount & Team Size
   - Monthly Budget (GBP)
   - Lab Type & Compliance/Licensing (e.g., CL2/CL3)
   - Move-in Timeline & Preferred Location
2. **Feasibility Check**: Automated hard-filters (budget, compliance containment, and timeline).
3. **Manual Qualification**: A broker verifies operational readiness, funding stage, and regulatory compliance.
4. **Curation**: Startups are matched only to vetted, structurally suitable lab assets.
5. **Execution**: Warm introductions lead to viewings and lease signings.

---

## 2. Landlord Workflow
We provide landlords with a curated, high-covenant pipeline for inventory that is operationally difficult to monetise through traditional channels.
1. **Inventory Onboarding**: Manual or AI-assisted ingestion of small-footprint lab assets.
2. **AI Document Parser**: Landlords can upload spec sheets, brochures, or lease files of any format. The AI reads, parses, and automatically extracts key fields (e.g., sq ft, power supply, ventilation details, containment levels) to fill out listings.
3. **Tenant Presentation**: Compliance-ready startups are presented to landlords with a **Broker's Rationale** and feasibility assessment.
4. **Lease Closing**: LabMatch acts as the intermediary to manage the lease lifecycle.
5. **Revenue**: Fees are triggered upon successful lease execution, with participation in renewals.

---

## 3. AI Matching Logic (Broker's Analyst)
To maintain operational speed without sacrificing quality, AI (powered by Gemma 4 / RunPod) functions as an analytical layer.

* **Deterministic Filtering**: SQL-based hard-filters ensure strict budget compliance, location requirements, and availability timelines.
* **AI Assessment**: The AI generates summaries, a 0–100 match score (Fit/Feasibility/Trust), and a broker’s rationale for manual review.
* **Guardrails**:
  - **No Autonomous Action**: The AI cannot initiate automated introductions or schedule viewings on its own.
  - **Compliance Lock**: Containment standards (CL2/CL3) are hard-locked. No AI-suggested "relaxations" are permitted.
  - **Confidence Threshold**: Match scores below 70% are automatically hidden or flagged for manual broker intervention.

---

## 4. Operational & Localisation Guidelines
All development on the LabMatch platform must adhere to the rules defined in [agent.md](file:///Users/saajanjassy/Downloads/Development/LabMatch/agent.md):
- **Localisation**: Default currency is Pound Sterling (`£`/`GBP`). Space sizes support both Square Feet (`sq ft`) and Square Metres (`sq m`). Validations strictly check UK Postcodes and Phone Numbers.
- **Security & Confidentiality**: Startup research descriptions (e.g., handling specific pathogens, chemical waste, radiation licensing) represent highly sensitive IP and must be encrypted and protected at all times.
