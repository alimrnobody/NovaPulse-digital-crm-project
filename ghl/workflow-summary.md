# GHL Workflows Overview

This project uses GoHighLevel (GHL) to automate client onboarding, engagement, and communication workflows.

---

## 1. NP - Contact Created
**Purpose:**
Triggered when a new contact is created from the client portal.

**Actions:**
- Tag contact as "client portal"
- Start onboarding journey
- Trigger Welcome Flow

---

## 2. NP - Welcome Flow
**Purpose:**
Initial onboarding communication after signup.

**Actions:**
- Send welcome email
- Send SMS confirmation
- Notify internal team

---

## 3. NP - Step Nudges
**Purpose:**
Encourage users to complete onboarding steps.

**Actions:**
- Send reminder emails
- Send follow-up SMS
- Track incomplete steps

---

## 4. NP - Kickoff Booking
**Purpose:**
Handle scheduling of kickoff calls.

**Actions:**
- Send booking link
- Confirm appointment
- Notify team

---

## 5. NP - Onboarding Complete
**Purpose:**
Triggered when all onboarding steps are completed.

**Actions:**
- Move pipeline to final stage
- Notify team
- Trigger next phase (delivery)

---

## 6. NP - Re-engagement
**Purpose:**
Re-engage inactive users.

**Actions:**
- Send reminder emails
- Send SMS nudges
- Move back into onboarding flow
