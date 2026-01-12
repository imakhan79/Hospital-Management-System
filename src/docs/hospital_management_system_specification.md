# Clinic/Hospital Management System: Workflow Specification & Journey Design

## Overview: The Unified Patient Journey
The system streamlines the patient's lifecycle from the initial booking to the final discharge and reporting. The transition between stages is governed by "Encounter Events" that trigger status updates and notify the next actor in the chain.

### Stage Transitions
1. **Appointment (`Booked`)**: Initial intent to visit.
2. **Check-in (`Arrived`)**: Physical presence confirmed.
3. **Vitals (`Vitals-Recorded`)**: Clinical baseline established.
4. **Queue (`Waiting`)**: Assigned to a specific doctor/clinic.
5. **Doctor Desk (`Consultation-Active`)**: Clinical decision making.
6. **Diagnostic/Pharma (`Auxiliary-Pending`)**: Fulfillment of orders.
7. **Billing (`Payment-Pending`)**: Financial settlement.
8. **Completion (`Closed`)**: Journey end, data archived for reporting.

---

## 1. Workflow Dashboard (Command Center)
**Purpose**: Centralized monitoring of clinic throughput and bottleneck identification.
**Actors**: Admin, Medical Director, Floor Manager.
**Statuses**: Monitor all stages.
**KPIs**:
- Total Patient Flow (Count)
- Avg. Wait Time (Vitals -> Doctor)
- SLA Violations (>30m in queue)
- Departmental Occupancy
**Visual Rules**:
- **Critical (Red)**: Patient waiting > 45 mins at any stage.
- **Warning (Yellow)**: Approaching SLA limits (20 mins).
- **Stable (Green)**: Within optimal processing time.
**Quick Actions**:
- `Call Patient`: Trigger voice/SMS alert.
- `Mark No-Show`: Move to cancelled.
- `Priority Bump`: Flag as "Emergency/VIP" to move to top of queue.

---

## 2. Book Appointment
**1. Purpose**: Schedule future or same-day visits.
**2. Actors**: Receptionist, Patient (Self-service), Call Center.
**3. Inputs**: Patient identifier (Name/ID), Dept, Doctor, Slot, Visit Type (Online/Physical), Referral source.
**4. Workflow**: 
   - Search Patient -> Select Doctor -> Check Availability -> Lock Slot -> Confirm.
**5. Statuses**: `Booked`, `Cancelled`, `Rescheduled`, `No-Show`.
**6. Validations**: No double-booking same doctor/slot; Patient must not have overlapping appointments.
**7. Notifications**: 
   - SMS: "Appt confirmed with Dr. X at 10 AM."
   - Email: Calendar invite attached.
**8. Audit Logs**: Who booked, Timestamp, IP/UserAgent.
**9. Dashboard Events**: `appointment_created`, `slot_occupied`.

---

## 3. Patient Check-in
**1. Purpose**: Confirm arrival and update profile.
**2. Actors**: Receptionist.
**3. Inputs**: ID verification, Insurance card scan, Consent digital signature.
**4. Workflow**: 
   - Locate Appointment -> Verify Identity -> Update Demographics -> Print Token -> Mark Arrived.
**5. Statuses**: `Arrived`, `Checked-in`.
**6. Validations**: Ensure "Arrived" time is recorded; Prevent check-in for future-dated apps.
**7. Notifications**: 
   - In-app (Nurse): "Patient [Name] checked-in for Vitals."
**8. Audit Logs**: Demographic changes, Consent capture.
**9. Dashboard Events**: `patient_arrived`, `checkout_wait_started`.

---

## 4. Vitals Station
**1. Purpose**: Record physiological baseline.
**2. Actors**: Nurse.
**3. Inputs**: BP (S/D), Heart Rate, Temp, SPO2, Weight, Height (Auto-BMI), Pain Score (1-10).
**4. Workflow**: 
   - Select Patient from Vitals Queue -> Record Vitals -> Flag Abnormalities -> Save -> Push to Queue.
**5. Statuses**: `Vitals-Pending`, `Vitals-In-Progress`, `Vitals-Completed`.
**6. Validations**: BP Range check (e.g., Systolic > 60 and < 250); Temp in Fahrenheit/Celsius sanity check.
**7. Notifications**: 
   - In-app (Doctor): "Abnormal vitals detected for [Patient] (BP: 180/110)."
**8. Audit Logs**: Specific measurements per user.
**9. Dashboard Events**: `vitals_recorded`, `abnormality_flagged`.

---

## 5. Queue Management
**1. Purpose**: Real-time traffic control of patients.
**2. Actors**: Receptionist, Nurse, Automated Queue System.
**3. Inputs**: Priority flag, Room assignment, Doctor reassignment.
**4. Workflow**: 
   - Auto-sort by Token/Priority -> Announcement -> Assign to Room -> Status update when patient enters room.
**5. Statuses**: `Waiting`, `Called`, `In-Consultation`.
**6. Validations**: Patient cannot be in two queues simultaneously.
**7. Notifications**: 
   - SMS/Display: "Token #145, please proceed to Room 4."
**8. Audit Logs**: Queue hopping, Average wait time calculations.
**9. Dashboard Events**: `queue_position_updated`, `patient_called`.

---

## 6. Doctor's Desk
**1. Purpose**: Clinical consultation and order entry.
**2. Actors**: Doctor.
**3. Inputs**: Chief Complaint, Diagnosis (ICD-10), Prescription (eRx), Lab/Rad Orders, Follow-up date.
**4. Workflow**: 
   - Review History/Vitals -> Consult -> Entry of Findings -> Sign Orders -> Mark Consultation Complete.
**5. Statuses**: `Consultation-In-Progress`, `Orders-Signed`, `Consultation-Closed`.
**6. Validations**: Duplicate drug check; Mandatory Diagnosis before closing.
**7. Notifications**: 
   - Pharmacy: "New prescription for [Patient]."
   - Lab: "Tests ordered for [Patient]."
**8. Audit Logs**: Every clinical entry (Non-erasable, only appendable/corrected).
**9. Dashboard Events**: `consultation_ended`, `orders_triggered`.

---

## 7. Pharmacy
**1. Purpose**: Medication fulfillment and counselling.
**2. Actors**: Pharmacist.
**3. Inputs**: Batch No., Expiry verification, Dispensed quantity.
**4. Workflow**: 
   - Verify Prescription -> Check Stock -> Pack -> Counsel -> Mark Dispensed -> Send to Billing.
**5. Statuses**: `Pending-Fulfillment`, `Dispensed`, `Substituted`.
**6. Validations**: Stock level check; High-risk medication double-verification.
**7. Notifications**: 
   - SMS: "Your meds are ready at Counter 2."
**8. Audit Logs**: Batch tracking (Narcotic logs if applicable).
**9. Dashboard Events**: `items_dispensed`, `stock_alert`.

---

## 8. Lab & Radiology
**1. Purpose**: Diagnostic testing and imaging.
**2. Actors**: Lab Tech, Radiologist.
**3. Inputs**: Sample ID, Result values, Imaging files (DICOM), Impressions.
**4. Workflow**: 
   - Sample Collection -> Processing -> Result Entry -> Pathologist Review -> Release.
**5. Statuses**: `Awaiting-Sample`, `In-Lab`, `Result-Ready`.
**6. Validations**: Critical value alert (Automatic re-check trigger).
**7. Notifications**: 
   - Doctor In-app: "Critical Lab Result released for [Patient]."
**8. Audit Logs**: Machine calibration logs, Technician signature.
**9. Dashboard Events**: `sample_collected`, `result_published`.

---

## 9. Billing
**1. Purpose**: Financial settlement.
**2. Actors**: Cashier.
**3. Inputs**: Discount codes, Payment method (Cash/Card/Insurance), Policy ID.
**4. Workflow**: 
   - Consolidate Charges -> Apply Discounts/Insurance -> Accept Payment -> Print Invoice -> Issue Clearance.
**5. Statuses**: `Awaiting-Payment`, `Partial-Paid`, `Fully-Paid`.
**6. Validations**: Total charges match order quantities; Insurance authorization check.
**7. Notifications**: 
   - SMS: "Payment link for invoice #INV-123: [URL]."
**8. Audit Logs**: Reversals, Discount approvals.
**9. Dashboard Events**: `invoice_generated`, `revenue_recorded`.

---

## 10. Video Consultation
**1. Purpose**: Tele-health service.
**2. Actors**: Doctor, Patient.
**3. Inputs**: Digital consent, Video/Audio stream.
**4. Workflow**: 
   - Link Sent -> Patient Joins Waiting Room -> Doctor Admits -> Consultation -> Close Session.
**5. Statuses**: `Link-Active`, `Connected`, `In-Session`, `Terminated`.
**6. Validations**: Connectivity test before start; Verified Patient ID.
**7. Notifications**: 
   - Email/Link: "Your Video Consultation starts in 5 mins."
**8. Audit Logs**: Session duration, Participants.
**9. Dashboard Events**: `tele_session_start`, `session_duration`.

---

## 11. Reports
**1. Purpose**: Data analytics and patient summaries.
**2. Actors**: Admin, Doctor, Patient.
**3. Inputs**: Date range, Dept, Filter criteria.
**4. Workflow**: 
   - Aggregate Data -> Filter -> Export PDF/Excel.
**5. Statuses**: `Generated`, `Archived`.
**6. Validations**: Data privacy (Anonymization for non-clinical admins).
**7. Notifications**: 
   - Patient: "Your holistic health report is ready in the portal."
**8. Audit Logs**: Document downloads/views.
**9. Dashboard Events**: `report_generated`.

---

## Mapping Table: Module -> Events -> Dashboard Widgets

| Module | Emitted Events | Dashboard Widget Affected |
| :--- | :--- | :--- |
| **Registration** | `patient_arrived`, `new_token_issued` | `Total Footfall`, `Current Queue Distribution` |
| **Vitals** | `vitals_completed`, `abnormality_flagged` | `Vitals Throughput`, `Urgent Care Alerts` |
| **Queue** | `patient_called`, `waiting_time_threshold` | `Live Kanban (Waiting)`, `Avg. Wait Time KPI` |
| **Doctor** | `consult_started`, `consult_ended` | `Doctor Occupancy Rate`, `Consultation Avg. Duration` |
| **Lab/Pharma** | `order_receieved`, `fulfillment_done` | `Diagnostic TAT (Turnaround Time)`, `Pending Fulfillment` |
| **Billing** | `invoice_settled`, `payment_voided` | `Daily Revenue Widget`, `Financial Settlement %` |
| **Video** | `tele_session_start` | `Telemedicine Stats` |
