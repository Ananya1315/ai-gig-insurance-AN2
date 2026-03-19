AI POWERED PARAMETRIC INSURANCE FOR FOOD DELIVERY PARTNERS
 (EG- ZOMATO/SWIGGY/RESTAURANT DELIVERY PARTNERS)- README
Food delivery workers earn most of their income during peak hour, yet disruptions like social curfews, festivals, restaurant shutdowns, and extreme weather conditions can completely stop their earnings. Our solutions provides a zero touch AI powered insurance system that automatically compensates their income loss
Problem statement

 Food delivery partners working with platforms such as Swiggy/Zomato depend entirely on real-time orders and peak-hour demand for their income. External disruptions such as heavy rain, extreme heat, pollution, along with social disruptions like curfews, festivals, and restaurant downtime, significantly impact their ability to work.
These disruptions can reduce order availability or completely halt operations, leading to immediate loss of income. Currently, there is no automated system that protects gig workers from such losses


 Persona and Scenario 
Persona: Food delivery workers working in Swiggy/Zomato/Private delivery partners with valid pay slip 
-Working hours:8-10 hrs 
-Daily earnings: 700 rupees - 1200 rupees 
-Peak hours: 12pm-3pm(lunch) and 6pm-10:30pm
-Maximum delivery radius : 5km-9km


Scenario:

1. Environment factors : A delivery partner logs in at 12 pm hoping for orders during lunch but due to heavy rain and blockage on roads , he/she won't be able to complete the orders of his/her specific location. Rains and natural calamities also hinder with the restaurants on hours affecting the workers incomes directly 
2. Social factors: A delivery partner logs in during dinner hours expecting high demand. However, due to a local festival or curfew, most restaurants in the area are closed, and order volume drops to zero. Despite being active, the worker earns nothing.
The system detects the environment/Social factors, checks the working location of the delivery partner and triggers the payout as credits in the websites dashboard which can be claimed by the user any time he needs it

Application Workflow:

Weekly Premium Model, Parametric Triggers & Platform Choice
Weekly Premium Model
The system uses a weekly subscription model (Monday–Sunday) aligned with gig workers’ earnings cycle.
Premium is calculated using:
Weekly payslip to help reduce or increase the premium(includes operation of restaurant in that location too)
Historical Rainfall data calculated every 10 years 
AQI trends every 5 years
Temperature conditions (>40°C) every 10 years 
Festival week will have lower premium amount(based on calendar data)
Based on all these parameters AI will give location Risk score, this score is divided into 3 categories 


Risk Zone
Premium (in rupees )
Payout (in rupees)
Low Risk 
100
300
Medium Risk
400
900
High Risk
700
1500


Trigger parameters 
- Trigger only occurs when below parameters happen during time frame of 7:30am-10am,12pm-3:30pm, 6:30pm-10:30
Light Rain (80mm-100mm)
High Rain (>100mm)
Heat (>40 degrees Celcius)
AQI quality 
Curfew 
Festivals day 










Scenario based for low Risk 
Risk Zone
Premium (in rupees)
Payout (in rupees)
Low Risk + Low Rain 
100
150
Low Risk+ High Rain
100
300
Low Risk + AQI
100
210
Low Risk+ Heat
100
210
Low Risk + Curfew 
100
300
Low Risk + Festival
70
150












 Scenario based for  medium Risk 
Risk Zone
Premium (in rupees)
Payout (in rupees)
Medium Risk + Low Rain 
400
450
Medium Risk+ High Rain
400
900
Medium Risk + AQI
400
630
Medium Risk+ Heat
400
630
Medium Risk + Curfew 
400
900
Medium  Risk + Festival
280
450








Scenario based for  High Risk 
Risk Zone
Premium (in rupees)
Payout (in rupees)
High Risk + Low Rain 
700
750
High Risk+ High Rain
700
1500
High Risk + AQI
700
1050
High Risk+ Heat
700
1050
High Risk + Curfew 
700
1500
High  Risk + Festival
490
750


Platform choice : App interface using react native 
Weekly payment payslip 
Users don’t have to click on the link every week to upload the payslip
They can easily open the app and upload the image from their gallery 
Real user behaviour 
Delivery partners primarily use smartphones for work (Swiggy/Zomato apps)
They are already comfortable with mobile interfaces
Notification Trigger 
Weekly notification trigger for users with autopay/ manual payment methods 



AI / ML Integration
Artificial Intelligence plays a crucial role in improving accuracy, automation, and fraud prevention in the system.
1. Risk Assessment & Premium Calculation
AI analyzes:
historical rainfall data
AQI trends
temperature conditions
festival patterns
weekly payslip data
Based on these parameters, the system assigns a Risk Score to each delivery zone:
Low Risk
Medium Risk
High Risk
This risk score dynamically determines:
weekly premium
payout limits


2. Smart Trigger Validation
Instead of relying on a single trigger, the system uses multi-signal validation:
Environmental signals (rain, heat, AQI)
Social signals (curfew, festivals)
Market signals (restaurant activity, order volume)
This ensures:
higher accuracy
reduced false payouts
real-world reliability
3. Fraud Detection & AI-Based Activity Validation Strategy
To ensure fair and accurate payouts, the system combines user confirmation with AI-based anomaly detection, preventing misuse while maintaining a simple and user-friendly experience.
1. Activity Confirmation Flow
When a disruption event (rain, curfew, festival, etc.) is detected:
The user receives a prompt:
→ “Were you active during this time?”
The user selects Yes / No
This provides a lightweight and quick interaction without adding friction to the user experience.
2. AI-Based Validation (Core Logic)
User input is not trusted directly. The system uses AI-based anomaly detection to validate claims by analyzing:
Session Activity Patterns
app usage duration
last active timestamps
Location Consistency
verifies presence within assigned delivery zone
detects abnormal or unrealistic movement
Behavioral Patterns
compares current activity with learned normal behavior
identifies anomalies in user activity
The AI model generates a confidence score for each claim based on these signals.

3. Decision Logic
Condition
Result
High confidence score + user confirms activity
 Payout Approved
Low confidence score
Flagged for review
User inactive or no response
 No payout


4. Role of Payslip
Payslip is used for:
verifying user authenticity
estimating income range
calculating premium
It is not used for real-time fraud detection, but helps in identifying long-term inconsistencies in user behavior.
Tech Stack
Frontend (Mobile App)
React Native
Backend
Node JS
Database
Mongo DB
AI / ML
Python
Scikit-learn
APIs
Weather API (OpenWeatherMap)
AQI API
News API (for curfew detection)
Payments
UPI simulation
Deployment
Netify(Low level) 
Cloud platforms- AWS (high level)



Development Plan 
Phase 1: Ideation and System architecture 
Define scenarios and requirements 
Design workflow
Calculate premiums and payouts 
Define policy T&C
Phase 2: Basic feature implementation and premium calculation 
Design and implement backend API’s 
Create basic registration with payslip and ID authentication and user login system 
creation of policy for each person 
Dynamic risk level calculation based on parameters by AI model 
Weekly premium calculation based on risk scores 
Phase 3: Trigger system  , Fraud detection and final polish 
Trigger model using AI
Implementation of overall credit payout system 
Fraud detection using AI for gps spoofing and false trigger claims 
Dashboard for credits and payouts 
Final UI polish and deployment 

Adversarial Defense & Anti-Spoofing Strategy(market crash)
To ensure the system remains secure against misuse and spoofing, we implement a multi-layered AI-driven validation approach that differentiates genuine users from malicious actors while maintaining fairness.
1. Differentiation: Genuine User vs Spoofed User
The system does not rely on a single signal like GPS. Instead, it uses multi-signal AI validation to differentiate between real and fake claims.
A user is considered genuine when:
The disruption is verified in their assigned delivery zone
The user confirms activity during the disruption window
Their session activity and movement patterns align with normal delivery behavior
A user is flagged as suspicious when:
Their behavior deviates from normal patterns (e.g., inactivity but claiming payout)
Location data shows inconsistencies or unrealistic movement
No correlation exists between disruption and user activity
This ensures that payouts are based on validated real-world conditions, not just user input.
2. Data Used for Fraud Detection (Beyond GPS)
The system analyzes multiple data points to detect spoofing and coordinated fraud:
Session Activity Data
app open/close time
last active timestamp
Behavioral Patterns
activity during peak hours
consistency with normal delivery usage
Location Consistency
presence within assigned delivery zone
detection of abnormal jumps or static spoofed locations
Device & Network Signals
device ID consistency
repeated claims from same device/IP
Trigger Correlation
validation with external APIs (weather, AQI, curfew)
matching user activity with real disruption events
Historical Patterns (Payslip)
weekly earnings trends
abnormal claim frequency
These signals allow the system to detect individual fraud and coordinated fraud patterns.
3. UX Balance: Fair Handling of Flagged Claims
The system is designed to avoid penalizing genuine users, especially in conditions like poor network during bad weather.
Soft Flagging
Suspicious claims are not immediately rejected
Marked for additional validation
Confidence-Based Decisions
High confidence → instant payout
Medium confidence → delayed payout or partial payout
Low confidence → flagged for review
User Transparency
Users are notified if their claim is under review
Clear status updates are provided
Fallback Handling
If disruption is strongly validated at zone level, partial payout may still be issued
Users are not penalized for temporary connectivity issues
This ensures a balance between fraud prevention and user fairness, maintaining trust in the system.
Policy Rules & Constraints
To ensure sustainability and prevent misuse, the system follows strict policy rules:
Initial registration fees of 200/- 
Weekly Subscription Model
Users must pay premium weekly (Monday–Sunday)
If premium is not paid for 2 consecutive weeks, policy is deactivated
User must re-activate policy by paying 250/- to continue coverage
Trigger Rules
Only 1 trigger allowed per day
Maximum 3 triggers per week
Multiple triggers in the same day are not allowed
Payout Conditions
Payout is only issued if:
policy is active
user belongs to affected zone
disruption is verified
user is active/available during that time
No Duplicate Claims
Same disruption event cannot trigger multiple payouts
Coverage Scope
Insurance covers loss of income only
No coverage for health, accidents, or vehicle damage

 Expected Impact
This platform provides a financial safety net for food delivery workers, ensuring stable income despite unpredictable disruptions.
By combining AI, real-time monitoring, and parametric insurance, the solution is scalable and tailored for India’s gig economy.


