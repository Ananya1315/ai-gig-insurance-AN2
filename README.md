# AI POWERED PARAMETRIC INSURANCE FOR FOOD DELIVERY PARTNERS

*(ZOMATO / SWIGGY / RESTAURANT DELIVERY PARTNERS)*

Food delivery workers earn most of their income during peak hour, yet disruptions like social curfews, festivals, restaurant shutdowns, and extreme weather conditions can completely stop their earnings.

Our solution provides a **AI powered insurance system** that automatically compensates their income loss.

---

## Problem Statement

Food delivery partners working with platforms such as Swiggy/Zomato depend entirely on real-time orders and peak-hour demand for their income.

External disruptions such as:

* heavy rain
* extreme heat
* pollution
* curfews
* festivals
* restaurant downtime

significantly impact their ability to work.

These disruptions can reduce order availability or completely halt operations, leading to **immediate loss of income**.

Currently, there is **no automated system** that protects gig workers from such losses.

---

## Persona and Scenario

### Persona

Food delivery workers working in Swiggy/Zomato/Private delivery partners with valid payslip

* Working hours: 8–10 hrs
* Daily earnings: ₹700 – ₹1200
* Peak hours:

  * 12 PM – 3 PM (Lunch)
  * 6 PM – 10:30 PM
* Maximum delivery radius: 5km – 9km

---

## Scenario

### 1. Environmental Factors

A delivery partner logs in at 12 PM hoping for orders during lunch, but due to heavy rain and blockage on roads, they are unable to complete deliveries.

Rain and natural calamities also affect restaurant operations, directly impacting worker income.

---

### 2. Social Factors

A delivery partner logs in during dinner hours expecting high demand. However, due to a local festival or curfew, most restaurants are closed, and order volume drops to zero.

Despite being active, the worker earns nothing.

---

The system detects environmental/social factors, checks the working location of the delivery partner, and **triggers payout as credits in the dashboard**, which can be claimed anytime.

---

## Application Workflow

![WhatsApp Image 2026-03-19 at 10 57 16 PM](https://github.com/user-attachments/assets/3a9c5bc0-aed1-4e3e-8f6a-3c93faa9dc7a)

---

## Weekly Premium Model, Parametric Triggers & Platform Choice

### Weekly Premium Model

The system uses a **weekly subscription model (Monday–Sunday)** aligned with gig workers’ earnings cycle.

Premium is calculated using:

* Weekly payslip (adjusts premium based on earnings and restaurant activity)
* Historical rainfall data (10 years)
* AQI trends (5 years)
* Temperature conditions (>40°C over 10 years)
* Festival weeks (lower premium based on calendar data)

Based on these, AI assigns a **Risk Score**:

---

### Risk Zones

| Risk Zone   | Premium (₹) | Payout (₹) |
| ----------- | ----------- | ---------- |
| Low Risk    | 15          | 45         |
| Medium Risk | 35          | 79         |
| High Risk   | 50          | 108        |

---

## Trigger Parameters

Trigger only occurs during:

* 7:30 AM – 10 AM
* 12 PM – 3:30 PM
* 6:30 PM – 10:30 PM

### Triggers:

* Light Rain (80mm–100mm)
* High Rain (>100mm)
* Heat (>40°C)
* AQI quality
* Curfew
* Festival day

---

## Scenario-Based Payouts

### Low Risk

| Condition | Premium | Payout |
| --------- | ------- | ------ |
| Low Rain  | 15      | 23     |
| High Rain | 15      | 45     |
| AQI       | 15      | 32     |
| Heat      | 15      | 32     |
| Curfew    | 15      | 45     |
| Festival  | 11      | 23     |

---

### Medium Risk

| Condition | Premium | Payout |
| --------- | ------- | ------ |
| Low Rain  | 35      | 40     |
| High Rain | 35      | 79     |
| AQI       | 35      | 56     |
| Heat      | 35      | 56     |
| Curfew    | 35      | 79     |
| Festival  | 25      | 41     |

---

### High Risk

| Condition | Premium | Payout |
| --------- | ------- | ------ |
| Low Rain  | 50      | 54     |
| High Rain | 50      | 108    |
| AQI       | 50      | 75     |
| Heat      | 50      | 75     |
| Curfew    | 50      | 108    |
| Festival  | 35      | 54     |

---

## Platform Choice

**App Interface using React Native**

* Weekly payment via payslip
* Users don’t need to open links every week
* Easy upload from gallery

### Reasons:

* Matches real user behaviour
* Delivery partners already use mobile apps
* Easy interaction
* Push notifications for:

  * premium reminders
  * payout alerts

---

## AI / ML Integration

### 1. Risk Assessment & Premium Calculation

AI analyzes:

* historical rainfall
* AQI trends
* temperature
* festival patterns
* payslip data

Assigns:

* Low Risk
* Medium Risk
* High Risk

Determines:

* premium
* payout

---

### 2. Smart Trigger Validation

Uses multi-signal validation:

* environmental signals
* social signals
* market signals

Ensures:

* higher accuracy
* reduced false payouts

---

## 3. Fraud Detection & AI-Based Activity Validation Strategy

### 1. Activity Confirmation Flow

When a disruption occurs:

* User receives prompt
  → “Were you active during this time?”
* User selects Yes / No

---

### 2. AI-Based Validation

System checks:

* session activity
* last active timestamp
* location consistency
* behavior patterns

AI generates **confidence score**

---

### 3. Decision Logic

| Condition              | Result          |
| ---------------------- | --------------- |
| High confidence + Yes  | Payout Approved |
| Low confidence         | Flagged         |
| No response / inactive | No payout       |

---

### 4. Role of Payslip

* verifies authenticity
* calculates premium
* detects long-term inconsistencies

(Not used for real-time fraud detection)

---

## Tech Stack

**Frontend**

* React Native

**Backend**

* Node.js

**Database**

* MongoDB

**AI/ML**

* Python (Scikit-learn)

**APIs**

* Weather API
* AQI API
* News API

**Payments**

* UPI Simulation

**Deployment**

* Netlify (low level)
* AWS (high level)

---

## Development Plan

### Phase 1

* Ideation
* System architecture
* Premium & policy design

### Phase 2

* Backend APIs
* Registration + payslip upload
* Policy creation
* Risk calculation

### Phase 3

* Trigger system
* Fraud detection
* Payout system
* Dashboard
* Final UI & deployment

---

## Adversarial Defense & Anti-Spoofing Strategy (Market Crash)

### 1. Differentiation

Uses **multi-signal AI validation instead of only GPS**

Genuine:

* correct zone
* active user
* matching behavior

Suspicious:

* inactive but claiming
* abnormal movement
* mismatch with events

---

### 2. Data Used

* session activity
* location consistency
* device & network signals
* API validation
* payslip trends

---

### 3. UX Balance

* soft flagging
* confidence-based payout
* partial payout
* user notifications

---

## Policy Rules & Constraints

* Registration fee: ₹200
* Weekly premium required
* No payment for 2 weeks → deactivated
* Reactivation fee: ₹250

### Trigger Rules

* 1 trigger per day
* max 3 per week

### Payout Conditions

* policy active
* valid disruption
* user active

### Coverage

* income loss only
* no health / vehicle coverage

---

## Expected Impact

* Financial safety net for gig workers
* Stable income during disruptions
* Automated compensation
* Scalable AI-based system

---
